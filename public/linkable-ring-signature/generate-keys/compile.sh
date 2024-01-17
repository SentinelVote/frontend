#!/bin/sh

# nix-shell -p --pure go
GOOS=js GOARCH=wasm go build -o main.wasm
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .
printf %s\\n "$(go env GOROOT)"
