#!/usr/bin/env bash

set -eo pipefail

echo
echo "Initializing a template..."

INIT_FILE_PATH="./scripts/commands/.initialized"

if [ ! -f "$INIT_FILE_PATH" ]; then
    mkdir -p contracts test

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
else
    echo "The project has already been initialized."
fi

echo
