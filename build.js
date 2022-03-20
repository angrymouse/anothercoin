require('esbuild').build({
    entryPoints: ['./contract-src.js'],
    bundle: true,
    outfile: 'contract.js',
    format:"iife",
    minify:true
  }).catch(() => process.exit(1))