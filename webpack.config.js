const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); CssMinimizerPlugin is better
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const isDev = process.env.NODE_ENV === 'development';
console.log("Development:", isDev);

// Використання оптимізацій коду при ствроренні бандлу в продакшн
function optimization() {
  const optimizationOptions = {
    splitChunks: {
      chunks: "all"
    }
  };
  if (!isDev) {
    optimizationOptions.minimizer = [
      new CssMinimizerPlugin(),
      new TerserJSPlugin({}),
    ]
  }
  return optimizationOptions
}
// Автоматична підстановка потрібного типу імені файлу
function filenameHashConfig(ext) {
  return isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
}

// конфігурує роботу лодерів обробки стилів
function stylesLoadersConfig(mainLoader) {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + '/';
        },
      },
    },
    'css-loader'
  ]

  if (mainLoader) {
    loaders.push(mainLoader);
  }

  return loaders;
}

// керування плагінами
function plugins() {
  const basePlagins = [
    new webpack.HotModuleReplacementPlugin(),
    // Видаляє непотрібні фали попередніх бандлів
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    //! Цей плагін модифікує тайтл сайту!!!
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      title: isDev ? 'Dev' : 'Webpack5 bundle',
      minify: {
        collapseWhitespace: !isDev,
        removeComments: !isDev,
      }
    }),

    new MiniCssExtractPlugin({ filename: filenameHashConfig("css") }),

    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, './src/assets'), to: path.resolve(__dirname, './dist/assets') },
      ]
    })
  ];

  if (!isDev) {
    basePlagins.push(new BundleAnalyzerPlugin())
  }

  return basePlagins;
}
// об'экт налаштувань WEBpack
module.exports = {
  context: path.resolve(__dirname, 'src'),
  // визнечення базового режиму роботи
  mode: "development",
  target: "web",
  // точка входу у вигляді об'єкту з основним скриптом у який імпортяться модулі та окремо бібліотеки
  entry: {
    main: ['@babel/polyfill', './ts/script.ts'],
    libs: ['./js/libs/lib_1.js']
  },
  // вивід результату
  output: {
    filename: filenameHashConfig("js"),
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.jpg', '.png'],
    alias: {
      '@components': path.resolve(__dirname, './src/js/jscomponents'),
      '@': path.resolve(__dirname, './src')
    }
  },

  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
              targets: {
                browsers: 'Chrome >= 80'
              }
            }]],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: 'Chrome >= 80'
                }
              }
              ],
              '@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/i,
        use: stylesLoadersConfig(),
      },
      {
        test: /\.s[ac]ss$/i,
        use: stylesLoadersConfig('sass-loader'),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
      }
    ]
  },

  optimization: optimization(),

  devtool: isDev ? 'source-map' : false,
  // devtool: 'inline-source-map',

  plugins: plugins(),

  devServer: {
    static: true,
    open: true
  },
};
