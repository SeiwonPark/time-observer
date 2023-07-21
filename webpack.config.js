const path = require('path')
const glob = require('glob')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  entry: {
    ...globEntries('./src/**/*.{ts,tsx}'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                },
                target: 'es2015',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
    new NodePolyfillPlugin(),
  ],
}

/**
 * Get all files that match the pattern from the `globPattern`.
 * @param {string} globPattern Path pattern for entry files.
 * @returns {object} An object consists of file name and path as key and value pair.
 */
function globEntries(globPattern) {
  const entries = {}
  glob.sync(globPattern).forEach((filePath) => {
    const entryName = path.basename(filePath, path.extname(filePath))
    entries[entryName] = filePath
  })
  return entries
}
