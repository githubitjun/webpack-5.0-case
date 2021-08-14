/*
 * @Author: 九天
 * @Date: 2021-08-09 18:53:15
 * @LastEditors: 九天
 * @LastEditTime: 2021-08-14 14:45:38
 * @Description: 
 * @FilePath: \20210413-koa\server.js
 */
// 掘金地址:  https://juejin.cn/post/6993318543315959816#heading-4
// 断点续传:  https://juejin.cn/post/6844904046436843527
// vue-simple-uploader   WebUploader 

//检测文件是否已经存在
// 另：fs模块中有个exists方法也可以用于检测文件是否存在，但官方文档中已经弃用，并推荐使用access方法。

const Koa = require('koa');
const Router = require('koa-router');
const koastatic = require('koa-static');
const fs = require('fs');
const formidable = require('formidable');
const multiparty = require('multiparty');
const SparkMD5 = require('spark-md5');
const path = require('path');
var bodyParser = require('koa-bodyparser');
const app = new Koa();


const exists = function exists(path) {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, err => {
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

//利用multiparty插件解析前端传来的form-data格式的数据，并上传至服务器
const multipartyUpload = function multipartyUpload(req, autoUpload) {
    let config = {
        maxFieldsSize: 200 * 1024 * 1024
    }
    // uploadDir:  存放上传文件的目录
    if (autoUpload) config.uploadDir = SERVER_PATH;
    return new Promise((resolve, reject) => {
        new multiparty.Form(config).parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            // console.log('fields--', fields, files)
            resolve({
                fields,
                files
            });
        });
    });
}


//将传进来的文件数据写入服务器
//form-data格式的数据将以流的形式写入
//BASE64格式数据则直接将内容写入
const writeFile = function (serverPath, file, isStream) {
    return new Promise((resolve, reject) => {
        if (isStream) {
            try {
                // 创建可读流
                let readStream = fs.createReadStream(file.path);
                // 创建可写流
                console.log(serverPath);
                
                let writeStream = fs.createWriteStream(serverPath);
                readStream.pipe(writeStream);
                readStream.on('end', () => {
                    resolve({
                        result: true,
                        message: '上传成功！'
                    });
                });
            } catch (err) {
                resolve({
                    result: false,
                    message: err
                })
            }
        } else {
            fs.writeFile(serverPath, file, err => {
                if (err) {
                    resolve({
                        result: false,
                        message: err
                    })
                    return;
                }
                resolve({
                    result: true,
                    message: '上传成功！'
                });
            });
        }
    });
}

//解析post请求参数，content-type为application/x-www-form-urlencoded 或 application/josn
const parsePostParams = function parsePostParams(req) {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields) => {
            console.log(err);
            console.log(fields);


            if (err) {
                reject(err);
                return;
            }
            resolve(fields);
        });
    });
}

/* 大文件切片上传后再合并
在后面要讲的大文件切片上传，断点续传中，一个大文件会被切成n多个小文件上传
在上传后我们需要再将这些切片文件合并成一个文件，从而实现大文件上传
主要利用内置fs模块中的appendFileSync和readFileSync方法
关键代码：fs.appendFileSync(serverFilePath, fs.readFileSync(filePath)) */

const pipeStream = (path, writeStream) => {
    return new Promise(resolve => {
        try {
            const readStream = fs.createReadStream(path);
            readStream.pipe(writeStream);
            readStream.on("end", () => {
                fs.unlinkSync(path);
                resolve();
            });
        } catch (error) {
            console.log(error);

            resolve({
                result: false,
                message: error
            })
        }


    });
}


const mergeFiles = async (hash, count, size) => {
    return new Promise(async (resolve, reject) => {
        const dirPath = `${SERVER_PATH}/${hash}`;
        // const chunkDir = path.resolve(UPLOAD_DIR, filename)
        if (!fs.existsSync(dirPath)) {
            reject('还没上传文件，请先上传文件');
            return;
        }
        // fs.readdirSync  该方法将返回一个包含“指定目录下所有文件名称”的数组对象。
        const filelist = fs.readdirSync(dirPath);
        if (filelist.length < count) {
            reject('文件还未上传完成，请稍后再试');
            return;
        }

        filelist.sort((a, b) => a.split("__")[1] - b.split("__")[1]);
        let arr = filelist.map((chunkPath, index) => {
            console.log(chunkPath, index);
            return pipeStream(
                `${dirPath}/${chunkPath}`,
                // 指定位置创建可写流
                fs.createWriteStream(`${dirPath}${hash}`, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        })
        console.log(arr);

        await Promise.all(arr);
        fs.rmdirSync(dirPath); // 合并后删除保存切片的目录
        resolve({
            path: `${HOSTNAME}/upload/${hash}`,
            filename: `${hash}`
        })
    })
}

//定义延迟函数
const delay = function delay(interval) {
    typeof interval !== 'number' ? interval = 1000 : null;
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, interval);
    });
}



let router = new Router();

//中间件：设置允许跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    //处理OPTIONS请求
    ctx.request.methods === 'OPTIONS' ? ctx.body = '请求测试成功' : await next();
});
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
const host = '192.168.31.189',
    port = 3000;
const HOSTNAME = `${host}:${port}`;
const SERVER_PATH = `${__dirname}/upload`;




//.......
//上传单个文件（form-data），利用第三方插件multipary解析并上传
router.post('/upload_single_file', async (ctx, next) => {
    try {
        let {
            files
        } = await multipartyUpload(ctx.req, true);
        let file = (files && files.file.length) ? files.file[0] : {};

        ctx.body = {
            code: 1,
            message: '文件上传成功',
            originalFilename: file.originalFilename,
            serverPath: file.path.replace(__dirname, HOSTNAME).replace('\\', '/'),
        }
    } catch (err) {
        console.log(err);

        ctx.body = {
            code: 0,
            message: '文件上传失败'
        }
    }
});


//上传单个文件（form-data），利用第三方插件解析但不直接上传，而是将文件重命名后再单独上传
router.post('/upload_single_formdata_rename', async (ctx, next) => {
    try {
        let {
            files,
            fields
        } = await multipartyUpload(ctx.req, false);
        // console.log(files, fields);
        let file = (files && files.file.length) ? files.file[0] : {};
        let {
            originalFilename
        } = (files && files.file.length) ? files.file[0] : {}

        let hash = (fields && fields.hash[0]); // 上传文件的唯一hash值
        let fileExtname = path.extname(originalFilename); // 获取文件的后缀名
        let filename = `${originalFilename}` // 原本的文件名
        const filePath = `${SERVER_PATH}/${hash}${fileExtname}`; // 文件存在的路径

        let isExist = await fs.existsSync(filePath);
        if (isExist) {
            // 文件名存在直接返回文件 
            ctx.body = {
                code: 1,
                message: '文件已经存在',
                originalFilename: filename,
                serverPath: `http://${HOSTNAME}/upload/${hash}${fileExtname}`,
            }
            return;
        }
        let obj = await writeFile(filePath, file, true);
   
        if (obj.result) {
            ctx.body = {
                code: 1,
                message: '文件上传成功',
                originalFilename: filename,
                serverPath: `http://${HOSTNAME}/upload/${hash}${fileExtname}`,
            }
        } else {
            ctx.body = {
                code: 0,
                message: '文件上传失败'
            }
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            code: 0,
            message: err
        }
    }
});



//大文件切片上传
/* api：/upload_chunk
请求方式：post
参数：FormData
Content-Type：form-data
返回值：application/json {code:0/1, message:'', filename,filepath}
在前端调用接口前会把大文件切成若干个小文件，然后按照“文件名_数字.xxx”的格式编号后分别传给服务端
服务器接收到文件后先解析出文件名（不包含数字部分），并以文件名命名创建一个临时目录用于存放所有的切片文件
由于是form-data个的，同样需要借助multiparty进行文件信息解析
最后调用writeFile方法以流的方式将切片文件保存到临时目录中 */
router.post('/upload_chunk', async (ctx, next) => {
    try {
        let {
            files,
            fields
        } = await multipartyUpload(ctx.req, false);

        let file = (files && files.file[0]) || {};
        let filename = (fields && fields.filename[0]) || '';
        let hash = (fields && fields.hash[0]);
        const dirPath = `${SERVER_PATH}/${filename}`;
        if (!fs.existsSync(dirPath)) {
            // fs.mkdirSync()方法用于同步创建目录。
            fs.mkdirSync(`${dirPath}`);
        }
        const filePath = `${dirPath}/${hash}`;
        const filePathName = `${dirPath}${filename}`;
        const isExists = await fs.existsSync(filePath);
        console.log(filePath, isExists);

        if (isExists) {
            ctx.body = {
                code: 1,
                message: '文件已经存在',
                originalFilename: filename,
                serverPath: `http://${HOSTNAME}/upload/${filename}`,
            }
            return;
        }
        let isPathName = await fs.existsSync(filePathName);
        if (isPathName) {
            ctx.body = {
                code: 2,
                message: '文件已经存在',
                originalFilename: filename,
                serverPath: `http://${HOSTNAME}/upload/${filePathName}`,
            }
            return;
        }
        await writeFile(filePath, file, true);
        ctx.body = {
            code: 1,
            message: '文件上传成功',
            serverPath: `http://${HOSTNAME}/upload/${filename}`,
        }
    } catch (err) {
        console.log(err);

        ctx.body = {
            code: 0,
            message: err
        }
    }
});




/* 
合并所有切片并删除临时目录和切片文件
api：/upload_merge
请求方式：post
参数：application/json {hash,count}
Content-Type：application/x-www-form-urlencoded
返回值：application/json {code:0/1, message:'', filename,filepath}
在所有的切片文件上传完成后，根据切片的数据和文件的名称（不包含数字部分）将所有切片合并成一个大文件，
切片合并完成后删除所有的切片文件和临时目录
调用parsePostParams解析出文件名（hash）和切片数量（count）参数
调用mergeFiles合并所有切片 */


//合并切片文件
router.post('/upload_merge', async (ctx, next) => {
    console.log(111);
    ctx.body = ctx.request.body
    console.log(ctx.body);

    const {
        hash,
        count,
        size
    } = ctx.body;
    console.log(hash, count, size);

    const {
        path,
        filename
    } = await mergeFiles(hash, count, size);
    ctx.body = {
        code: 1,
        message: '文件上传合并成功',
        path,
        filename
    }
});

// 获取文件后缀名 
const extractExt = file_name => file_name.slice(file_name.lastIndexOf('.', file_name.length))

// 断点续传
router.post('/upload_break_chunk', async (ctx, next) => {
    try {
        let { files, fields } = await multipartyUpload(ctx.req, false);
        console.log('files--', files)
        console.log('fields--', fields)
        let file = (files && files.file[0]) || {};
        let fileHash = (fields && fields.fileHash[0]) || '';
        let filename = (fields && fields.filename[0]) || '';
        let hash = (fields && fields.hash[0]) || '';

        let file_ext = extractExt(filename); // 文件后缀
        let fileHashUrl = `${SERVER_PATH}/${fileHash}${file_ext}`
        let isPathName = fs.existsSync(fileHashUrl);
        if (isPathName) {
            ctx.body = {
                code: 2,
                message: '原文件已经存在',
                originalFilename: filename,
                serverPath: `http://${HOSTNAME}/upload/${fileHash}${file_ext}`,
            }
            return;
        }


        const fileHashDir = `${SERVER_PATH}/${fileHash}`
        if (!fs.existsSync(fileHashDir)) {
            // fs.mkdirSync 方法用于同步创建目录
            fs.mkdirSync(fileHashDir)
        }

        const hashDir = `${SERVER_PATH}/${fileHash}/${hash}`
        const isExists = fs.existsSync(hashDir);
        if (isExists) {
            ctx.body = {
                code: 1,
                message: 'hash块文件已经存在',
                originalFilename: filename,
                serverPath: `http://${HOSTNAME}/upload/${fileHash}/${hash}`,
            }
            return;
        }


        await writeFile(hashDir, file, true);
        ctx.body = {
            code: 1,
            message: '文件上传成功',
            serverPath: `http://${HOSTNAME}/upload/${fileHash}${file_ext}`,
        }
    } catch (error) {
        console.log(error);

        ctx.body = {
            code: 0,
            message: error
        }
    }
})

// 断点续传--合并切片文件
router.post('/upload_break_merge', async (ctx, next) => {
    ctx.body = ctx.request.body
    console.log(ctx.body);

    const {
        filename,
        fileHash,
        count,
        size
    } = ctx.body;
    console.log(filename, fileHash, count, size);
    let file_ext = extractExt(filename); // 文件后缀
    let filePath = `${SERVER_PATH}/${fileHash}${file_ext}`
    let fileHashDir = `${SERVER_PATH}/${fileHash}`

    // 判断原文件存不存在
    let isFilePath = fs.existsSync(filePath);
    if (isFilePath) {
        ctx.body = {
            code: 1,
            message: '原文件已经存在',
            path: `http://${HOSTNAME}/upload/${fileHash}${file_ext}`,
        }
        return
    }
    // 判断原文件的hash块文件存不存在
    // fs.readdirSync  该方法将返回一个包含“指定目录下所有文件名称”的数组对象。
    let fileHashList = fs.readdirSync(fileHashDir)
    if (fileHashList.length < count) {
        console.log(fileHashList);

        ctx.body = {
            code: 1,
            message: 'hash文件块还未上传完整,请继续上传',
            fileHashList, // 已上传的hash 块的文件名称
        }
        return
    }
    const {
        path,
        fileName
    } = await mergeBreakFiles(filePath, fileHashDir, count, size);
    ctx.body = {
        code: 1,
        message: '文件上传合并成功',
        path,
        fileName
    }
})

function replaceAll(find, replace, str) {
    var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(find, 'g'), replace);
}

const mergeBreakFiles = async (filePath, fileHashDir, count, size) => {
    return new Promise(async (resolve, reject) => {
        // const dirPath = `${SERVER_PATH}/${hash}`;
        if (!fs.existsSync(fileHashDir)) {
            reject('还没上传hash文件块，请先上传文件');
            return;
        }
        // fs.readdirSync  该方法将返回一个包含“指定目录下所有文件名称”的数组对象。
        const filelist = fs.readdirSync(fileHashDir);
        if (filelist.length < count) {
            reject('hash文件块还未上传完整，请稍后再试');
            return;
        }

        filelist.sort((a, b) => a.split("__")[1] - b.split("__")[1]);
        let arr = filelist.map((chunkPath, index) => {
            console.log(chunkPath, index);
            return pipeStream(
                `${fileHashDir}/${chunkPath}`,
                // 指定位置创建可写流
                fs.createWriteStream(`${filePath}`, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        })
        console.log(arr);
        await Promise.all(arr);
        fs.rmdirSync(fileHashDir); // 合并后删除保存切片的目录
        resolve({
            path: `${HOSTNAME}/upload/${filePath}`,
            fileName: `${filePath}`
        })
    })
}

//.......



app.use(bodyParser());
app.use(koastatic('./'));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, function () {
    console.log('======================================================================');
    console.log(`The server started at port: ${port}, you can access it by ${HOSTNAME}`);
    console.log('======================================================================');
});
