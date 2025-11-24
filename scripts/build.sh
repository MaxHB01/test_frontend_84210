#!/bin/bash
set -e
rm -rf .next

npm ci
npm run build