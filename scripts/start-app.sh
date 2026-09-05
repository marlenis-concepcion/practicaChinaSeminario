#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

case "${1:-}" in
  uno)
    APP_DIR="$ROOT_DIR/APP-Seminario-Uno"
    FRONTEND_DIR="$APP_DIR/apps/frontend"
    BACKEND_DIR=""
    DEPENDENCIES_READY="$APP_DIR/node_modules"
    ;;
  dos)
    APP_DIR="$ROOT_DIR/APP-Semininario-Dos"
    FRONTEND_DIR="$APP_DIR/frontend"
    BACKEND_DIR="$APP_DIR/backend"
    DEPENDENCIES_READY="$FRONTEND_DIR/node_modules"
    ;;
  *) echo "Uso: $0 uno|dos"; exit 1 ;;
esac

if [[ ! -d "$DEPENDENCIES_READY" || ( -n "$BACKEND_DIR" && ! -d "$BACKEND_DIR/node_modules" ) ]]; then
  echo "Faltan dependencias. Consulta scripts/README.md para instalarlas."
  exit 1
fi

if [[ -z "$BACKEND_DIR" ]]; then
  cd "$FRONTEND_DIR"
  exec npm run dev
else
  (cd "$BACKEND_DIR" && npm run start:dev) &
  BACKEND_PID=$!
  (cd "$FRONTEND_DIR" && npm run dev) &
  FRONTEND_PID=$!
  cleanup() { kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true; }
  trap cleanup EXIT INT TERM
  wait
fi
