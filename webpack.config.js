'use strict';

const path = require('path');
const webpack = require('sgmf-scripts').webpack;
const ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin'];
const helpers = require('./webpack/helpers');
const cwd = process.cwd();

var bootstrapPackages = {
    Alert: 'exports-loader?Alert!bootstrap/js/src/alert',
    // Button: 'exports-loader?Button!bootstrap/js/src/button',
    // Carousel: 'exports-loader?Carousel!bootstrap/js/src/carousel',
    Collapse: 'exports-loader?Collapse!bootstrap/js/src/collapse',
    // Dropdown: 'exports-loader?Dropdown!bootstrap/js/src/dropdown',
    Modal: 'exports-loader?Modal!bootstrap/js/src/modal',
    // Popover: 'exports-loader?Popover!bootstrap/js/src/popover',
    Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/src/scrollspy',
    Tab: 'exports-loader?Tab!bootstrap/js/src/tab',
    // Tooltip: 'exports-loader?Tooltip!bootstrap/js/src/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/src/util'
};

// Defaults
const variables = helpers.getVariables();

module.exports = [{
    mode: variables.mode,
    name: 'js',
    watch: !variables.isProdMode,
    entry: helpers.getJsFiles(),
    output: {
        path: path.resolve(
            './cartridges/' + variables.cartridge + '/cartridge/static'
        ),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            base: path.resolve(cwd, variables.getRemoteAlias('sfra','js')),
            core: path.resolve(cwd, variables.getCartridgeAlias(variables.cartridges.core, 'js'))
        }
    },
    externals: {
        constants: 'window.Constants',
        resources: 'window.Resources',
        urls: 'window.Urls',
        sitePreferences: 'window.SitePreferences'
    },
    module: {
        rules: [
            {
                test: /bootstrap(.)*\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread'],
                        cacheDirectory: true
                    }
                }
            }
        ]
    },
    plugins: [new webpack.ProvidePlugin(bootstrapPackages)]

}, {
    mode: variables.mode,
    name: 'scss',
    watch: !variables.isProdMode,
    entry: helpers.getScssFiles(),
    devtool: 'source-map',
    output: {
        path: path.resolve(
            './cartridges/' + variables.cartridge + '/cartridge/static'
        ),
        filename: '[name].css'
    },
    resolve: {
        alias: {
            base: path.resolve(cwd, variables.getRemoteAlias('sfra', 'scss')),
            core: path.resolve(cwd, variables.getCartridgeAlias(variables.cartridges.core, 'scss'))
        },
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        new webpack.DefinePlugin({
            DEBUG: !variables.isProdMode
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: helpers.getCssLoader()
            }
        ]
    }
}];
