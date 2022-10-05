const { nodeExternalsPlugin } = require('esbuild-node-externals');

module.exports = (o) => {
  return {
    packager: 'npm',
    bundle: true,
    minify: true,
    sourcemap: false,
    keepNames: true,
    plugins: [nodeExternalsPlugin()],
    exclude: ['aws-sdk', 'ts-node'],
    tsconfig: 'tsconfig.json',
    packagerOptions: {
      scripts: ['npx clean-modules@2.0.4 --yes --exclude "**/makefile*"']
    }
  };
};
