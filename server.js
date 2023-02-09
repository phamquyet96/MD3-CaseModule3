const http=require('http');
const url = require("url");
const Handle=require('./Controller/Handles/Handle')
const fs = require("fs");

const server=http.createServer((req, res)=>{

    let mimeTypes={
        'jpg' : 'images/jpg',
        'png' : 'images/png',
        'js' :'text/javascript',
        'css' : 'text/css',
        'svg':'image/svg+xml',
        'ttf':'font/ttf',
        'woff':'font/woff',
        'woff2':'font/woff2',
        'eot':'application/vnd.ms-fontobject'
    }

    let urlPath =url.parse(req.url).pathname;
    const filesDefences = urlPath .match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname  + req.url).pipe(res)
    } else{
        switch (urlPath){
            case '/':
                Handle.homepage(req,res).catch(err=>{
                    console.log(err.message);
                });
                break;
            case '/product':
                Handle.showList(req,res).catch(err=>{
                    console.log(err.message);
                });
                break;
            case '/product/add':
                Handle.addProduct(req,res).catch(err=>{
                    console.log(err.message);
                });
                break;
            case '/product/delete':
                Handle.deleteProduct(req,res).catch(err=>{
                    console.log(err.message);
                });
                break;
            case '/product/update':
                Handle.updateProduct(req,res).catch(err=>{
                    console.log(err.message);
                });
                break;
            case '/list/update':
                Handle.updateProductList(req,res).catch(err=>{
                    console.log(err.message);
                });
                break;

            default:
                res.end();

        }
    }


});

server.listen(8000,()=>{
    console.log('Server is running at localhost:8000');
})