#!/bin/env bash

rm -f test/output/*
node dist/etsy-to-gnucash.js --inputDir=test/input --outDir=test/output
for file in $(ls test/expected/); do diff -q test/expected/$file test/output/$file; done
