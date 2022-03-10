require('esbuild').build({
    entryPoints: ['./contract-src.js'],
    bundle: true,
    outfile: 'contract.js',
    format:"iife",
    minify:false
  }).catch(() => process.exit(1))