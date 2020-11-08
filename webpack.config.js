const path = require('path');

module.exports = {
    entry: './lib/ramzor.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ramzor.js',
        library: 'Ramzor',
        libraryTarget: 'umd',
        globalObject: 'this'
    }
};