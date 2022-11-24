#!/bin/env bash

rm -f test/output/*.csv
node dist/etsy-to-gnucash.js --inputDir=test/input --outDir=test/output
diff test/output/input_converted.csv test/expected.csv
