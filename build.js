require('esbuild')
  .build({
    entryPoints: ['src/main.ts'],
    external: [],
    bundle: true,
    target: 'node14',
    platform: 'node',
    outfile: 'dist/etsy-to-gnucash.js',
    plugins: [],
		sourcemap: true,
  })
  .then(() => console.log('Finished successfully.'))
  .catch((error) => {
    console.log(`Finished erroneously. Error encountered: ${error.message}`);
    process.exit(1);
  });
