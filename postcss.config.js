/**
 * Config for the postcss-loader used in the webpack config.
 *
 * The postcss-loader edits any css using the listed plugins.
 *
 * 'autoprefixer' automatically adds vendor-prefixes for better browser support
 */

/* eslint-disable global-require */
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
};
