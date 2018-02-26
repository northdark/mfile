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
const util = require('../lib/util');

function getSuffixName(fileName) {
    let nameList = fileName.split('.');
    return nameList[nameList.length - 1];
}

const filePath = config.getLocalPath();
const upload = async function (ctx) {
    let req = ctx.req;
    let busboy = new Busboy({headers: req.headers});
    let auth = ctx.state.auth;
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
                let localPath = formData['localPath'];
                let localPathRes = path.parse(localPath);
                fileName = localPathRes.base || Math.random().toString(16).substr(2) + '.' + getSuffixName(fieldname)
            }
            let saveTo = path.join(filePath, auth.u, fileName);
            let pathRes = path.parse(saveTo);
            fsExtra.ensureDirSync(pathRes.dir);
            // 文件保存到制定路径
            file.pipe(fs.createWriteStream(saveTo));
            // 文件写入事件结束
            file.on('end', function () {
                result.success = true;
                result.message = '文件上传成功';
                result.url = `https://s4.meituan.net/xm/mfile${saveTo.replace(config.getCDNPrefix(), '')}`;
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
};
const list = async function (ctx) {
    let {path: localPath} = ctx.request.body;
    let auth = ctx.state.auth;
    if (!localPath) {
        localPath = './'
    }
    let srcPath = path.join(filePath, auth.u, localPath);
    let fileList = fs.readdirSync(srcPath);
    let dir = ``;
    fileList.forEach(function (file) {
        let filePath = path.join(srcPath, file);
        let stat = fs.statSync(filePath),
            size = 0, url = '-';
        if (stat.isDirectory()) {
            size = util.sizeConvert(true, stat.size);
            file += '/';
        } else {
            size = util.sizeConvert(false, stat.size);
            url = `https://s4.meituan.net/xm/mfile${filePath.replace(config.getCDNPrefix(), '')}`;
        }
        let mtime = util.formatDate('yy-MM-dd hh:mm', stat.mtimeMs);

        dir += `${file}    ${mtime}    ${size}    ${url}\n`;
    })
    ctx.body = dir;
};
module.exports.register = function (router) {
    router.post('/upload', upload);
    router.post('/list', list);
};
