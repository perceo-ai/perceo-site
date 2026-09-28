#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat <<'USAGE'
Usage: VERSION=X.Y.Z scripts/build-archductor-package-repositories.sh

Downloads Archductor release .deb/.rpm assets, verifies checksum manifests, and
builds static APT and DNF repositories under public/apt and public/rpm.

Required environment:
  VERSION                         Release version without leading v.
  ARCHDUCTOR_APT_SIGNING_KEY      ASCII-armored private key used for APT metadata.
  ARCHDUCTOR_RPM_SIGNING_KEY      ASCII-armored private key used for RPM packages and metadata.

Optional environment:
  ARCHDUCTOR_GPG_PASSPHRASE       Signing key passphrase, if required.
  ARCHDUCTOR_APT_GPG_KEY_ID       Explicit APT GPG key id/fingerprint.
  ARCHDUCTOR_RPM_GPG_KEY_ID       Explicit RPM GPG key id/fingerprint.
  ARCHDUCTOR_GPG_KEY_ID           Shared fallback GPG key id/fingerprint.
  GH_TOKEN                        GitHub token for release downloads.
USAGE
}

fail() {
    echo "error: $*" >&2
    exit 1
}

need() {
    command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

checksum_file() {
    local manifest="$1"
    local file="$2"
    local name
    local expected
    local actual

    name="$(basename "$file")"
    expected="$(awk -v filename="$name" '$2 == filename || $2 == "./" filename { print $1; found = 1; exit } END { if (!found) exit 1 }' "$manifest")" \
        || fail "$manifest has no checksum entry for $name"
    actual="$(sha256sum "$file" | awk '{ print $1 }')"
    [ "$actual" = "$expected" ] || fail "checksum mismatch for $name"
}

sign_file() {
    local key_env="$1"
    local input="$2"
    local output="$3"
    local mode="$4"

    local key="${!key_env:-}"
    [ -n "$key" ] || fail "$key_env is required for signing"

    local gpg_home
    gpg_home="$(mktemp -d)"
    chmod 700 "$gpg_home"
    printf '%s\n' "$key" | gpg --batch --homedir "$gpg_home" --import >/dev/null

    local specific_key_id_name="${key_env%_SIGNING_KEY}_GPG_KEY_ID"
    local key_id="${!specific_key_id_name:-${ARCHDUCTOR_GPG_KEY_ID:-}}"
    if [ -z "$key_id" ]; then
        key_id="$(gpg --batch --homedir "$gpg_home" --list-secret-keys --with-colons | awk -F: '$1 == "fpr" { print $10; exit }')"
    fi
    [ -n "$key_id" ] || fail "could not determine signing key id"

    local passphrase_args=()
    if [ -n "${ARCHDUCTOR_GPG_PASSPHRASE:-}" ]; then
        passphrase_args=(--pinentry-mode loopback --passphrase "$ARCHDUCTOR_GPG_PASSPHRASE")
    fi

    if [ "$mode" = "clear" ]; then
        gpg --batch --yes --homedir "$gpg_home" "${passphrase_args[@]}" \
            --default-key "$key_id" --clearsign --digest-algo SHA256 \
            --output "$output" "$input"
    else
        gpg --batch --yes --homedir "$gpg_home" "${passphrase_args[@]}" \
            --default-key "$key_id" --armor --detach-sign --digest-algo SHA256 \
            --output "$output" "$input"
    fi

    rm -rf "$gpg_home"
}

export_public_key() {
    local key_env="$1"
    local output="$2"
    local binary="$3"
    local key="${!key_env:-}"
    [ -n "$key" ] || fail "$key_env is required for public key export"

    local gpg_home
    gpg_home="$(mktemp -d)"
    chmod 700 "$gpg_home"
    printf '%s\n' "$key" | gpg --batch --homedir "$gpg_home" --import >/dev/null

    if [ "$binary" = "1" ]; then
        gpg --batch --homedir "$gpg_home" --export > "$output"
    else
        gpg --batch --homedir "$gpg_home" --armor --export > "$output"
    fi

    rm -rf "$gpg_home"
}

sign_rpms() {
    local key="${ARCHDUCTOR_RPM_SIGNING_KEY:-}"
    [ -n "$key" ] || fail "ARCHDUCTOR_RPM_SIGNING_KEY is required for RPM signing"
    if [ -n "${ARCHDUCTOR_GPG_PASSPHRASE:-}" ]; then
        fail "RPM signing in CI requires an unprotected RPM signing subkey"
    fi

    local gpg_home
    gpg_home="$(mktemp -d)"
    chmod 700 "$gpg_home"
    printf '%s\n' "$key" | gpg --batch --homedir "$gpg_home" --import >/dev/null

    local key_id="${ARCHDUCTOR_RPM_GPG_KEY_ID:-${ARCHDUCTOR_GPG_KEY_ID:-}}"
    if [ -z "$key_id" ]; then
        key_id="$(gpg --batch --homedir "$gpg_home" --list-secret-keys --with-colons | awk -F: '$1 == "fpr" { print $10; exit }')"
    fi
    [ -n "$key_id" ] || fail "could not determine RPM signing key id"

    local rpm_home
    rpm_home="$(mktemp -d)"
    {
        echo "%_signature gpg"
        echo "%_gpg_path $gpg_home"
        echo "%_gpg_name $key_id"
        echo "%_gpgbin $(command -v gpg)"
    } > "$rpm_home/.rpmmacros"

    HOME="$rpm_home" rpmsign --define "_topdir $workdir/rpm-top" \
        --addsign "$@"
    rm -rf "$gpg_home" "$rpm_home"
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
    usage
    exit 0
fi

version="${VERSION:-}"
[ -n "$version" ] || fail "VERSION is required"
[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] \
    || fail "VERSION must look like MAJOR.MINOR.PATCH"

need apt-ftparchive
need createrepo_c
need dpkg-scanpackages
need gh
need gpg
need rpm
need rpmsign
need sha256sum

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

release_tag="v$version"
cli_deb="archductor_${version}-1_amd64.deb"
cli_rpm="archductor-${version}-1.x86_64.rpm"
desktop_deb="archductor-desktop_${version}_amd64.deb"
desktop_rpm="archductor-desktop-${version}.x86_64.rpm"

gh release download "$release_tag" \
    --repo perceo-ai/conductor-arch \
    --dir "$workdir" \
    --clobber \
    --pattern "$cli_deb" \
    --pattern "$cli_rpm" \
    --pattern "$desktop_deb" \
    --pattern "$desktop_rpm" \
    --pattern "SHA256SUMS" \
    --pattern "SHA256SUMS-desktop-linux.txt"

checksum_file "$workdir/SHA256SUMS" "$workdir/$cli_deb"
checksum_file "$workdir/SHA256SUMS" "$workdir/$cli_rpm"
checksum_file "$workdir/SHA256SUMS-desktop-linux.txt" "$workdir/$desktop_deb"
checksum_file "$workdir/SHA256SUMS-desktop-linux.txt" "$workdir/$desktop_rpm"

apt_root="$repo_root/public/apt"
rpm_root="$repo_root/public/rpm"
rm -rf "$apt_root/dists" "$apt_root/pool" "$rpm_root/x86_64"

install -d "$apt_root/pool/main/a/archductor" "$apt_root/dists/stable/main/binary-amd64"
install -m 0644 "$workdir/$cli_deb" "$apt_root/pool/main/a/archductor/"
install -m 0644 "$workdir/$desktop_deb" "$apt_root/pool/main/a/archductor/"
(
    cd "$apt_root"
    dpkg-scanpackages --arch amd64 pool > dists/stable/main/binary-amd64/Packages
    gzip -9c dists/stable/main/binary-amd64/Packages > dists/stable/main/binary-amd64/Packages.gz
    apt-ftparchive release dists/stable > dists/stable/Release
)
export_public_key ARCHDUCTOR_APT_SIGNING_KEY "$apt_root/archductor-archive-keyring.gpg" 1
sign_file ARCHDUCTOR_APT_SIGNING_KEY "$apt_root/dists/stable/Release" "$apt_root/dists/stable/InRelease" clear
sign_file ARCHDUCTOR_APT_SIGNING_KEY "$apt_root/dists/stable/Release" "$apt_root/dists/stable/Release.gpg" detach

install -d "$rpm_root/x86_64"
install -m 0644 "$workdir/$cli_rpm" "$rpm_root/x86_64/"
install -m 0644 "$workdir/$desktop_rpm" "$rpm_root/x86_64/"
sign_rpms "$rpm_root/x86_64/$cli_rpm" "$rpm_root/x86_64/$desktop_rpm"
createrepo_c "$rpm_root/x86_64"
export_public_key ARCHDUCTOR_RPM_SIGNING_KEY "$rpm_root/RPM-GPG-KEY-archductor" 0
sign_file ARCHDUCTOR_RPM_SIGNING_KEY "$rpm_root/x86_64/repodata/repomd.xml" "$rpm_root/x86_64/repodata/repomd.xml.asc" detach

echo "Archductor package repositories generated for $release_tag"
