const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin(),//自动根据配置生成html文件
  ],
  //设置引用模块
  resolve: {
    extensions: ['.ts', '.js']// ts和js结尾的文件都可以作为模块使用
  },
  module: {
    rules: [
    // 设置less文件的处理
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          // 引入postcss
          // 类似于babel，把css语法转换为兼容旧版的浏览器语法
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [// 浏览器兼容插件
                  [
                    "postcss-preset-env",
                    {
                      browsers: 'last 2 versions'// 每个浏览器最新两个版本
                    }
                  ]
                ]
              }
            }
          },
         "less-loader"
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {// 使用对象配置babel
            loader: "babel-loader",
            options: {// 设置预设环境
              presets: [
                [
                  // 指定环境的插件
                  "@babel/preset-env",
                  // 配置信息
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      "chrome": "58",
                      "ie": "11"
                    },
                    "corejs": "3",// 指定core版本
                    "useBuiltIns": "usage"// 使用corejs的方式“usage”表示按需加载
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ],
        exclude: /node-modules/
      }
    ]
  }
}