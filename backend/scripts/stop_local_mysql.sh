#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="${MYSQL_LOCAL_HOME:-$HOME/mysql-local}"
PID_FILE="$BASE_DIR/run/mysql.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No mysql pid file found at $PID_FILE"
  exit 0
fi

PID=$(cat "$PID_FILE")
if [[ -z "$PID" ]]; then
  echo "PID file is empty"
  exit 1
fi

if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  for _ in {1..20}; do
    if ! kill -0 "$PID" 2>/dev/null; then
      rm -f "$PID_FILE"
      echo "MySQL stopped"
      exit 0
    fi
    sleep 0.5
  done

  kill -9 "$PID" 2>/dev/null || true
fi

rm -f "$PID_FILE"
echo "MySQL stopped"
