Archductor APT repository root.

Client setup:
  https://www.perceo.ai/apt/archductor.sources
  https://www.perceo.ai/apt/archductor-archive-keyring.gpg

Repository metadata under dists/ and packages under pool/ are generated during
package publication. Do not publish this route as ready until the repository is
signed and install, launch, upgrade, checksum, and removal validation pass on a
fresh Debian or Ubuntu VM.
