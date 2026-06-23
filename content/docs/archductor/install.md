# Install and build

AppImage and native packages are the main path. Flatpak is still experimental because arbitrary repository paths often need broad filesystem access.

## AppImage / GitHub release artifact

```bash
curl -Lo linux-conductor.AppImage https://github.com/pranavkannepalli/conductor-arch/releases/latest/download/linux-conductor-x86_64.AppImage
chmod +x linux-conductor.AppImage
./linux-conductor.AppImage
```

## .deb / Ubuntu-Debian

```bash
sudo apt install ./linux-conductor_0.1.0_amd64.deb
```

## .rpm / Fedora / openSUSE

```bash
sudo dnf install ./linux-conductor-0.1.0-1.x86_64.rpm
```

## Arch / AUR

```bash
cd packaging/aur
makepkg -si
```

## Flatpak (experimental)

```bash
flatpak run io.github.pranavkannepalli.linux-conductor
```

## Build from source

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y git gh sqlite3 openssh-client pkg-config libgtk-4-dev libadwaita-1-dev

# Fedora
sudo dnf install -y git gh sqlite openssh-clients pkgconf-pkg-config gtk4-devel libadwaita-devel

# Arch
sudo pacman -S --needed git github-cli sqlite openssh pkgconf gtk4 libadwaita
```

```bash
git clone https://github.com/pranavkannepalli/conductor-arch
cd conductor-arch
cargo fmt --all -- --check
cargo test -p linux-conductor-core -p linux-conductor -p linux-conductor-gtk
cargo build --workspace --release --locked
./target/release/linux-conductor-gtk
```
