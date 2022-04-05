## 笔记

## 需要安装的依赖

    yarn add typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-json execa --ignore-workspace-root-check

## 执行 npx tsc --init

    可以自动生成tsconfig.json 文件

## import Shared from '@vue/shared' 自己的包互相引用
    1. package.json 中配置如下
        "workspaces": [
                "packages/*"
            ],
    2.然后在tsconfig.json 中配置如下
        "moduleResolution":"Node",
        "baseUrl": "./",   
        "paths": {
        "@vue/*":[
                "packages/*/src"
            ] 
        },