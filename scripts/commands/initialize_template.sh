#!/usr/bin/env bash

set -eo pipefail

if [ -f ".ci_mode" ]; then
    exit 0
fi

INIT_FILE_PATH="./scripts/commands/.initialized_template"

if [ ! -f "$INIT_FILE_PATH" ]; then
    echo
    echo "Initializing the template..."

    rm -f LICENSE

    touch "$INIT_FILE_PATH"

    echo "Initialized."

    # Prompt to commit changes after initialization.
    overwrite=""
    echo
    echo "Commit changes after initialization? (y/n) -> "
    read -r overwrite
    echo

    if [ "$overwrite" == "y" ]; then
        git add .
        git commit -m "chore: remove the template's license"

        echo "Do not forget to push this commit."
        echo
    fi
fi

echo
