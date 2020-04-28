const webpack = require('webpack'),
         path = require('path');

const appRoot = path.resolve(__dirname, '..');

function root() {
    var newArgs = Array.prototype.slice.call(arguments, 0);

    return path.join.apply(path, [appRoot].concat(newArgs));
};

module.exports = function (env) {
    const isTests = env && env.target === 'tests';

    const config = {
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.mjs', '.css', '.scss'],
            modules: [
                root('src'),
                root('src', 'app'),
                root('src', 'app', 'style'),
                root('src', 'sdk'),
                root('node_modules')
            ]
        },

        module: {
            rules: [{
                test: /\.d\.ts?$/,
                use: [{
                    loader: 'ignore-loader'
                }],
                include: [/node_modules/]
            }]
        }
    };

    if (!isTests) {
        config.entry = {
            'app': './src/app/index.tsx',
            'sdk': './src/sdk/index.tsx',
        };

        config.output = {
            filename: '[name].js',

            publicPath: 'https://localhost:3000/',

            globalObject: 'this'
        };
    }

    config.module.rules.push({
        test: /\.ts[x]?$/,
        use: [{
            loader: 'ts-loader',
            options: {
                context: root('src', 'app'),
                configFile: root('src', 'app', 'tsconfig.json')
            }
        }],
        include: root('src', 'app')
    });

    config.module.rules.push({
        test: /\.ts[x]?$/,
        use: [{
            loader: 'ts-loader',
            options: {
                context: root('src', 'sdk'),
                configFile: root('src', 'sdk', 'tsconfig.json')
            }
        }],
        include: root('src', 'sdk')
    });

    return config;
};