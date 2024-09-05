
const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")

const cssRule = {
  test: /\.css$/i,
  include: path.resolve(__dirname, "src"),
  
  use: [
      {
        
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        }
      },
      {
        loader: 'postcss-loader'
      }
  ],
}

const mediaRule = {
  test: /\.(png|jpg|jpeg|svg)$/i,
  include: path.resolve(__dirname, "src"),
  type: "asset/resource"
}

const javascriptRule = {
  test: /\.js$/i,
  exclude: /[\\/]node_modules[\\/]/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: [
          ['@babel/preset-env', {targets: "defaults"}]
        ],
        cacheDirectory: true,
      }
    }
  ]
}
module.exports =  (env, argv) => {
  const mode = argv.mode
  const isProductionMode = mode == "production"

  return {
    entry: ["./src/index.js", "./src/assets/styles/index.css"],
    mode: "development",
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 
        isProductionMode 
        ? "[name].bundle.[contenthash].js"
        : "[name].bundle.js",
        clean: true
    },
    module: {
      rules: [
          cssRule,
          mediaRule,
          javascriptRule
      ],
    },
    ...(!isProductionMode && {devtool:"eval-cheap-module-source-map"}),
    devServer: {
      static: "./dist",
      watchFiles:['src/**/*'] // to detect changes on all files inside src directory
    },
    plugins: [
      new htmlWebpackPlugin({
        "template": "./src/index.html",
        "filename": 
        isProductionMode
        ? "index.[contenthash].html"
        : "index.html",
        "cache": true
      }), 
      new MiniCssExtractPlugin({
        "filename": 
        isProductionMode
        ? "index.bundle.[contenthash].css"
        : "index.bundle.css",
        
        
      }),
      new FaviconsWebpackPlugin({
        "logo": "./src/assets/icons/icon-512x512.png",
        "inject": true,
        "devMode": "webapp",
        "cache": true,
        "outputPath": "./assets/icons",
        "prefix": "./assets/icons/", // Use prefix instead of "OutputPath" to prevent generated HTML to refer to correct dir
        "favicons": {
          "icons": {
            "android": true,
            "appleIcon": true,
            "favicons": true,
            "appleStartup": false,
            "windows": false,
            "yandex": false
          }
        },
        
      }),
    ],

    //Enable cache for all files 
    cache: {
      type: 'filesystem', 
      cacheDirectory: path.resolve(__dirname, '.temp_cache')
    },
    optimization: {
      moduleIds: "deterministic",
      runtimeChunk: "single", //Only load necesary chunks when change happens
      //Separate all production libs on a separate chunk
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    }
  }
};