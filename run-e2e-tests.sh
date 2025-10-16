#!/bin/bash

echo "=========================================="
echo "Running WORKING E2E Tests"
echo "=========================================="
echo ""
echo "File: tests/working-e2e.spec.ts"
echo ""

npx playwright test tests/working-e2e.spec.ts --reporter=list

echo ""
echo "=========================================="
echo "E2E Test Run Complete!"
echo "=========================================="
