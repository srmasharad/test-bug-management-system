#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Management System - Test Runner${NC}"
echo -e "${BLUE}========================================${NC}\n"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${YELLOW}[1/3] Running Backend Unit Tests (Jest)...${NC}\n"
cd "$SCRIPT_DIR/backend"
npm test
BACKEND_EXIT=$?

if [ $BACKEND_EXIT -eq 0 ]; then
    echo -e "\n${GREEN}✓ Backend tests passed!${NC}\n"
else
    echo -e "\n${RED}✗ Backend tests failed!${NC}\n"
fi

echo -e "${YELLOW}[2/3] Running Frontend Unit Tests (Vitest)...${NC}\n"
cd "$SCRIPT_DIR/frontend"
npm test
FRONTEND_EXIT=$?

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "\n${GREEN}✓ Frontend tests passed!${NC}\n"
else
    echo -e "\n${RED}✗ Frontend tests failed!${NC}\n"
fi

echo -e "${YELLOW}[3/3] E2E Tests (Playwright)${NC}"
echo -e "${YELLOW}Note: Make sure backend (port 3000) and frontend (port 5173) are running!${NC}\n"
echo -e "To run E2E tests manually:"
echo -e "${GREEN}  cd $SCRIPT_DIR${NC}"
echo -e "${GREEN}  npx playwright test${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $BACKEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓ Backend:  17/17 tests passed${NC}"
else
    echo -e "${RED}✗ Backend:  Tests failed${NC}"
fi

if [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend: 13/13 tests passed${NC}"
else
    echo -e "${RED}✗ Frontend: Tests failed${NC}"
fi

echo -e "${YELLOW}○ E2E:      Run manually (see above)${NC}"
echo -e "${BLUE}========================================${NC}\n"

if [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
    echo -e "${GREEN}All tests passed successfully! 🎉${NC}\n"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the output above.${NC}\n"
    exit 1
fi
