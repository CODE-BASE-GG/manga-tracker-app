#!/usr/bin/env bash
set -euo pipefail
role="manga_tracker"
database="manga_tracker"
password="manga_tracker"

sudo -u postgres psql -v ON_ERROR_STOP=1 -d postgres \
  -c "CREATE ROLE ${role} LOGIN PASSWORD '${password}';" 2>/dev/null \
  || sudo -u postgres psql -v ON_ERROR_STOP=1 -d postgres \
    -c "ALTER ROLE ${role} WITH LOGIN PASSWORD '${password}';"

sudo -u postgres psql -v ON_ERROR_STOP=1 -d postgres \
  -tc "SELECT 1 FROM pg_database WHERE datname = '${database}'" \
  | grep -q 1 \
  || sudo -u postgres createdb -O "${role}" "${database}"

DATABASE_TARGET=local npm exec prisma migrate deploy
