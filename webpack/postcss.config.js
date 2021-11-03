const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const postCssConfig = {
    plugins: [
        autoprefixer({
            // Tell Autoprefixer not to remove outdated prefixes
            // We don't include any by default, so this just speeds up build time
            remove: false
        })
    ]
}

if (process.env.NODE_ENV === 'production') {
    postCssConfig.plugins.push(
        cssnano({
            // use the safe preset so that it doesn't
            // mutate or remove code from our css
            preset: ['default', {
                colormin: false,
                minifyGradients: false
            }]
        })
    );
}

module.exports = postCssConfig;
