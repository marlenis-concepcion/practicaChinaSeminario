#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
APP="${1:-}"
FEATURE="${2:-}"

case "$APP" in
  uno) FRONTEND_SRC="$ROOT_DIR/APP-Seminario-Uno/apps/frontend/src" ;;
  dos) FRONTEND_SRC="$ROOT_DIR/APP-Semininario-Dos/frontend/src" ;;
  *) echo "Uso: $0 uno|dos nombre-de-funcionalidad"; exit 1 ;;
esac

if [[ ! "$FEATURE" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "La funcionalidad debe usar minúsculas y guiones, por ejemplo: historial-sesiones"
  exit 1
fi

TARGET="$FRONTEND_SRC/features/$FEATURE"
if [[ -e "$TARGET" ]]; then
  echo "Ya existe: $TARGET"
  exit 1
fi

mkdir -p "$TARGET/components" "$TARGET/services" "$TARGET/types" "$TARGET/__tests__"
printf '# %s\n\nDocumenta aquí el objetivo, requisitos bilingües y criterios de aceptación.\n' "$FEATURE" > "$TARGET/README.md"
echo "Funcionalidad creada en: $TARGET"
