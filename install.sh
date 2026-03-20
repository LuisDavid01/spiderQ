#!/usr/bin/env bash
set -e

log() {
  echo -e "\n🚀 $1\n"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

detect_pm() {
  if has_command apt; then
    echo "apt"
  elif has_command pacman; then
    echo "pacman"
  elif has_command dnf; then
    echo "dnf"
  elif has_command yum; then
    echo "yum"
  else
    echo "unknown"
  fi
}

install_deps() {
	PM=$(detect_pm)
	case $PM in
		"apt")
			sudo apt update
			sudo apt install -y nodejs nmap whois golang-go 
			;;
		"pacman")
			sudo pacman -S nodejs nmap whois go 
			;;
		"dnf")
			sudo dnf update
			sudo dnf install -y nodejs nmap whois go 
			;;
		"yum")
			sudo yum install -y nodejs nmap whois go 
			;;
		*)
			echo "Unknown package manager"
			exit 1
			;;
	esac
}



install_tools() {
  log "\e[32mInstalando herramientas globales...\e[0m"

  if ! has_command npm; then
    echo "❌ npm no está instalado"
    exit 1
  fi

  if ! has_command mmdc; then
   npm install -g @mermaid-js/mermaid-cli
  fi

  if ! has_command bun; then
    log "Instalando Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
  fi
  if ! has_command ffuf; then
   log "Instalando ffuf..."
   go install github.com/ffuf/ffuf/v2@latest
  fi
}


install_project() {
  if [ -f "package.json" ]; then
    log "Instalando dependencias del proyecto..."
    bun install
  else
    echo "⚠️ No hay package.json, se omite bun install"
  fi
}

init_app() {
	log "Inicializando archivos de configuración..."
	bun run spiderq:init
	log "Spiderq instalado correctamente"

}


install_deps
install_tools
install_project
log "Dependencias instaladas correctamente"
init_app
