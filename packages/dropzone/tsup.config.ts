import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['esm'],
  dts: {
    compilerOptions: {
      jsx: 'react-jsx',
      jsxImportSource: 'preact'
    }
  }
})
