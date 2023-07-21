const path = require('path')

module.exports = {
  mode: "production",
  entry: {
    app :[
      './src/index.ts',
      './src/firebaseRepo.ts',
      './src/documentStuff.ts',
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
}