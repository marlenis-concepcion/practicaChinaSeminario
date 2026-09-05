#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Validando APP-Seminario-Uno"
(cd "$ROOT_DIR/APP-Seminario-Uno" && npm run typecheck && npm run build)

echo "Validando APP-Semininario-Dos"
(cd "$ROOT_DIR/APP-Semininario-Dos" && npm run build)
