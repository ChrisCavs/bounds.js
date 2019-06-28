import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

export default {
  input: 'src/bounds.js',
  output: {
    file: 'dist/bounds.js',
    format: 'umd',
    name: 'bounds'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ["env", {
          "modules": false
        }]
      ],
      plugins: [
        "external-helpers"
      ]
    }),
    uglify(),
  ]
}
