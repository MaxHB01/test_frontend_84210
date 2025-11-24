#!/bin/bash
set -e
rm -rf package
mkdir -p package

mkdir -p package/.next

cp -R .next/standalone/* package/
cp -R .next/standalone/.next/* package/.next || true
cp -R .next/static package/.next/static || true
cp -R public package/public || true