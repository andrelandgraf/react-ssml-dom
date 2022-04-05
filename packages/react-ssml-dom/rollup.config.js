import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(`./package.json`);

export default {
  input: `./index.ts`,
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [peerDepsExternal(), commonjs({ exclude: 'node_modules/*' }), typescript()],
};
