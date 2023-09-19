import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssimport from 'postcss-import';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

const extensions = ['js', 'jsx', 'ts', 'tsx', 'mjs'];

const config = [
  {
    input: './src/index.ts',
    output: [
      {
        dir: './dist',
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [
      nodeResolve({ extensions }),
      babel({
        exclude: 'node_modules/**',
        extensions,
        include: ['src/**/*'],
        babelHelpers: 'bundled',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      }),
      commonjs(),
      peerDepsExternal(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        plugins: [cssimport(), autoprefixer()],
      }),
    ],
    external: [/node_modules/],
  },
];

export default config;
