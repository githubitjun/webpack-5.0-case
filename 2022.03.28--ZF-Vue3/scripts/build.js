// 把packages 目录下所有的包进行打包
const fs = require('fs');
const execa = require("execa"); // 开启子进程 进行打包 最终使用rollup来并行打包


const targets = fs.readdirSync('packages').filter(f => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    }
    return true;
})

// 对我们目标依次进行打包, 并行打包
async function build(target) {
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
        stdio: 'inherit' // 当子进程打包的信息共享给父进程
    })
}

function runParallel(targets, iteratorFn) {
    let res = []
    for (const item of targets) {
        const p = iteratorFn(item)
        res.push(p)
    }
    return Promise.all(res)
}
runParallel(targets, build)