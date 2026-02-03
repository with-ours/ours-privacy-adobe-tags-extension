#!/bin/bash
set -e
echo "Validating extension structure..."
npx @adobe/reactor-validator
echo "Validation passed."
