/**
 * Created by ximing on 2/26/18.
 */
'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs');
const fsExtra = require('fs-extra');

const Busboy = require('busboy');
const config = require('../lib/config');

function getSuffixName(fileName) {
    let nameList = fileName.split('.');
    return nameList[nameList.length - 1];
}

const filePath = config.getLocalPath();
const upload = async function (ctx) {
    let req = ctx.req;
    let res = ctx.res;
    let busboy = new Busboy({headers: req.headers});
    let auth = req.headers.authorization;
    if (auth) {
        let authVal = auth.split(" ");
        if (authVal.length > 1) {
            let auth = new Buffer(authVal[1], 'base64').toString('utf-8');
            if (config.getAuth().includes(auth)) {
                let res = await new Promise((resolve, reject) => {
                    console.log('文件上传中...')
                    let result = {
                        success: false,
                        url: '',
                    };
                    let formData = {};
                    // 解析请求文件事件
                    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                        let fileName = formData['remotePath'];
                        if (!fileName) {
                            fileName = filename || Math.random().toString(16).substr(2) + '.' + getSuffixName(filename)
                        }
                        let saveTo = path.join(filePath, auth.split(':')[0], fileName);
                        let pathRes = path.parse(saveTo);
                        fsExtra.ensureDirSync(pathRes.dir);
                        // 文件保存到制定路径
                        file.pipe(fs.createWriteStream(saveTo));
                        // 文件写入事件结束
                        file.on('end', function () {
                            result.success = true;
                            result.message = '文件上传成功';

                            console.log('文件上传成功！');
                            resolve(result)
                        })
                    });

                    // 解析表单中其他字段信息
                    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                        console.log('表单字段数据 [' + fieldname + ']: value: ' + val);
                        formData[fieldname] = val;
                    });

                    // 解析结束事件
                    busboy.on('finish', function () {
                        console.log('文件上结束')
                        resolve(result)
                    })

                    // 解析错误事件
                    busboy.on('error', function (err) {
                        console.log('文件上出错')
                        reject(result)
                    });

                    req.pipe(busboy)
                });
                return ctx.body = res;
            }
        }
    }
    ctx.body = 'error auth'
};

module.exports.register = function (router) {
    router.post('/upload', upload);
};
