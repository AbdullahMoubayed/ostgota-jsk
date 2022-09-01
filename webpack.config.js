const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/src/index.js',
  output: {
    path: path.resolve(__dirname + '/public', 'dist'),
    filename: 'bundle.js',
  },
  watch: true,
};
