// 把packages 目录下所有的包进行打包
const fs = require('fs');
const execa = require("execa"); // 开启子进程 进行打包 最终使用rollup来并行打包


const targets = fs.readdirSync('packages').filter(f => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    }
    return true;
})

const target = 'reactivity'; // dev 模式指定打包某一个包 不像build 中全部循环打包

// 对我们目标依次进行打包, 并行打包
async function build(target) {
    // -cw :  dev 环境中使用 -cw 参数可以实现打包监听
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
        stdio: 'inherit' // 当子进程打包的信息共享给父进程
    })
}
build(target)
