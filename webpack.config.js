const path = require('path')

module.exports = {
    entry: {
      app :['./src/index.js', './src/roomCardCreator.js', './src/firebasseRepo.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
}  