'use strict'
require('./check-versions')()
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

process.env.NODE_ENV = 'production'

function rmDirAsyncParalle(dir, cb) {
  fs.stat(dir, (err, stats) => {
      if(stats && stats.isDirectory()) {
          fs.readdir(dir, (err, dirs) => {
              if (dirs.length === 0) {
                  fs.rmdir(dir, cb);
                  return;
              }
              dirs.map((d) =>{
                  let current = path.join(dir, d);
                  rmDirAsyncParalle(current, done);
              })
              let index = 0;
              function done() {
                  index++;
                  if(index === dirs.length) {
                      fs.rmdir(dir, cb);
                  }
              }
          })
      }else{
          fs.unlink(dir, cb);
      }
  })
}
console.log(chalk.blue("\n delete folder /dist/trunk/webfront/front/dist         [start]"));
// 异步删除dist
rmDirAsyncParalle('dist/trunk/webfront/front/dist', () => {
  console.log(chalk.green("\n delete folder /dist/trunk/webfront/front/dist         [success]"));
})

const ora = require('ora')
const rm = require('rimraf')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
