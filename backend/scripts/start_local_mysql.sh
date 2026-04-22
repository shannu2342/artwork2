#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="${MYSQL_LOCAL_HOME:-$HOME/mysql-local}"
PORT="${MYSQL_PORT:-3306}"
ROOTFS="$BASE_DIR/rootfs"
MYSQLD="$ROOTFS/usr/sbin/mysqld"
LIB_PATH="$ROOTFS/usr/lib/x86_64-linux-gnu:$ROOTFS/lib/x86_64-linux-gnu"

if [[ ! -x "$MYSQLD" ]]; then
  echo "MySQL local runtime not found at $MYSQLD"
  echo "Expected location: $HOME/mysql-local"
  exit 1
fi

mkdir -p "$BASE_DIR/data" "$BASE_DIR/run" "$BASE_DIR/log" "$BASE_DIR/mysql-files" "$BASE_DIR/tmp"

if [[ ! -d "$BASE_DIR/data/mysql" ]]; then
  LD_LIBRARY_PATH="$LIB_PATH" "$MYSQLD" \
    --no-defaults \
    --basedir="$ROOTFS/usr" \
    --datadir="$BASE_DIR/data" \
    --socket="$BASE_DIR/run/mysql.sock" \
    --port="$PORT" \
    --initialize-insecure
fi

if lsof -iTCP:"$PORT" -sTCP:LISTEN -nP 2>/dev/null | rg -q mysqld; then
  echo "MySQL already running on 127.0.0.1:$PORT"
  exit 0
fi

LD_LIBRARY_PATH="$LIB_PATH" "$MYSQLD" \
  --no-defaults \
  --mysqlx=0 \
  --basedir="$ROOTFS/usr" \
  --datadir="$BASE_DIR/data" \
  --socket="$BASE_DIR/run/mysql.sock" \
  --port="$PORT" \
  --bind-address=127.0.0.1 \
  --pid-file="$BASE_DIR/run/mysql.pid" \
  --log-error="$BASE_DIR/log/mysql.err" \
  --secure-file-priv="$BASE_DIR/mysql-files" \
  --tmpdir="$BASE_DIR/tmp" \
  --daemonize

echo "MySQL started on 127.0.0.1:$PORT"
