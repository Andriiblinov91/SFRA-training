require('dotenv').config();
const path = require('path');
const cwd = process.cwd();
const globEntry = require('webpack-glob-entry');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const defaultSfraPath = '../storefront_reference_architecture';

const getVariables = () => {
    const coreCartridgeName = require(path.join(cwd, './package.json')).packageName;
    const cartridge = !process.env.ctrg ? coreCartridgeName : process.env.ctrg;
    const mode = process.env.NODE_ENV ? process.env.NODE_ENV : 'none';
    const cartridges = require('../package.json').cartridges;
    const isProdMode = mode === 'production';

    const remoteIncludes = {
        sfra: {
            path: process.env.SFRA_PATH ? process.env.SFRA_PATH : defaultSfraPath,
            cartridge: 'app_storefront_base'
        }
    };

    return {
        mode: mode,
        isProdMode: isProdMode,
        cartridge: cartridge,
        cartridges: cartridges,
        getRemoteAlias: (includeName, dataType) => `${remoteIncludes[includeName].path}/cartridges/${remoteIncludes[includeName].cartridge}/cartridge/client/default/${dataType}`,
        getCartridgeAlias: (cartridge, dataType) => `./cartridges/${cartridge}/cartridge/client/default/${dataType}`
    }
};

const variables = getVariables();

const getJsFiles = () => {
    const result = {};
    const jsFiles = globEntry(path.resolve(cwd, `./cartridges/${variables.cartridge}/cartridge/client/default/js/*.js`));

    Object.entries(jsFiles).forEach(item => {
        const name = item && item.length ? item[0] : '';
        const filePath = item && item.length ? item[1] : '';
        if (name.indexOf('_') !== 0) {
            let location = path.relative(path.join(cwd, `./cartridges/${variables.cartridge}/cartridge/client`), filePath);
            location = location.substr(0, location.length - 3)
            result[location] = filePath;
        }
    });

    return result;
};

const getScssFiles = () => {
    const result = {};

    const cssFiles = globEntry(path.resolve(cwd, `./cartridges/${variables.cartridge}/cartridge/client/**/scss/**/*.scss`));

    Object.entries(cssFiles).forEach(item => {
        const name = item && item.length ? item[0] : '';
        const filePath = item && item.length ? item[1] : '';
        if (name.indexOf('_') !== 0) {
            let location = path.relative(path.join(cwd, `./cartridges/${variables.cartridge}/cartridge/client`), filePath);
            location = location.substr(0, location.length - 5).replace('scss', 'css');
            result[location] = filePath;
        }
    });

    return result;
};

const getCssLoader = () => ExtractTextPlugin.extract({
    use: [
        {
            loader: 'css-loader',
            options: {
                // Don't use css-loader's automatic URL transforms
                url: false,
                sourceMap: !variables.isProdMode
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                config: {
                    path: path.resolve(cwd, './webpack/postcss.config.js')
                },
                sourceMap: !variables.isProdMode
            }
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: !variables.isProdMode,
                implementation: require("sass"),
                sassOptions: {
                    includePaths: [
                        path.resolve(cwd, variables.getRemoteAlias('sfra', 'scss')),
                        path.resolve(cwd, variables.getCartridgeAlias(variables.cartridges.core, 'scss'))
                    ]
                },
                webpackImporter: true
            }
        },
    ]
});

module.exports = {
    getJsFiles,
    getScssFiles,
    getVariables,
    getCssLoader
};
