module.exports = {
  target: 'node',
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/demo-build`,
    publicPath: '/',
    filename: 'main.js',
  },
  devServer: {
    contentBase: './dist',
  },
  devtool: 'inline-source-map',
};
