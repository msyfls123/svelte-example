import svelte from 'rollup-plugin-svelte'
import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import serve from "rollup-plugin-serve"
import html from "rollup-plugin-bundle-html"
import css from "rollup-plugin-css-porter"
import typescript from "rollup-plugin-typescript2"
import typescriptCompiler from "typescript"
import { terser } from "rollup-plugin-terser"
import livereload from "rollup-plugin-livereload"
import sveltePreprocessor from "svelte-preprocess"
import babel from 'rollup-plugin-babel'

const hot = process.env.NODE_ENV === "development"

const plugins = [
  svelte({
    dev: hot,
    extensions: [".svelte"],
    preprocess: sveltePreprocessor(),
  }),
  html({
    template: "src/index.html",
    dest: "dist",
    filename: "index.html"
  }),
  css({
    dest: 'dist/index.css',
    raw: false
  }),
  resolve(),
  commonjs({ include: "node_modules/**" }),
  typescript({ typescript: typescriptCompiler }),
  babel({
    extensions: [ '.js', '.mjs', '.html', '.svelte' ],
    runtimeHelpers: true,
    exclude: [ 'node_modules/@babel/**', 'node_modules/core-js/**' ],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            ie: '11'
          },
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
        }
      ],
    ]
  }),
];
if (process.env.NODE_ENV === "development") {
  plugins.push(
    serve({
      contentBase: './dist',
      open: true
    }),
    livereload({ watch: "./dist" })
  );
} else {
  plugins.push(terser({ sourcemap: true }))
}

module.exports = {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    sourcemap: true,
    format: "iife"
  },
  plugins
}