# About

This repository provides a tool to convert Etsy Finance CSV export file to a format that can be imported in GNUCash transaction import tool.

## Example

Before:

```
TBD
```

After:

```
TBD
```

# How to use

- `npm ci`
- `npm run build`
- `node dist/etsy-to-gnucash.js --inputDir=<dir having csv files to convert> --outDir=<dir receiving converted csv files>`
- `outDir` will then have as many files as `inputDir`
- Every file in `outDir` will be suffixed with `_converted` to avoid overwriting if `inputDir` === `outDir`
- cleanup, either in `inputDir` or `outDir` is left to you

# Tests

Of course there are tests, just `npm run test` !
