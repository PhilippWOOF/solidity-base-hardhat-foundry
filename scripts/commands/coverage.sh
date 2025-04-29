#!/usr/bin/env bash

set -euo pipefail

coverage_hardhat() {
    pnpm clean:cov
    TS_NODE_TRANSPILE_ONLY=true pnpm hardhat coverage
}

coverage_foundry() {
    mkdir -p coverage/forge
    forge coverage --force --report lcov --lcov-version 2.2 -r coverage/forge/lcov.info
    genhtml coverage/forge/lcov.info --rc derive_function_end_line=0 --branch-coverage -o coverage/forge
}

echo
echo "Generating coverage..."
echo

coverage_hardhat
coverage_foundry

echo
echo "Coverage generated."
echo
