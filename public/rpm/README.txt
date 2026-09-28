Archductor RPM repository root.

Client setup:
  https://packages.perceo.ai/rpm/archductor.repo
  https://packages.perceo.ai/rpm/RPM-GPG-KEY-archductor

Repository metadata under x86_64/repodata and RPM packages under x86_64/ are
generated during package publication. Do not publish this route as ready until
the packages and repository metadata are signed and install, launch, upgrade,
checksum, and removal validation pass on a fresh Fedora VM.
