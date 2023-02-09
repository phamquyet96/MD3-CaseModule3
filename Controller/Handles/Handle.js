const BaseHandle=require('./baseHandle');
const qs = require("qs");
const formidable=require('formidable');
const fs = require("fs");
const url = require("url");
class Handle extends BaseHandle{
    async homepage(req, res){
        let html=await this.getTemplate('./Views/homepage.html');
        res.write(html);
        res.end();
    };
    delete1(i){
        console.log(i)

    }

    async showList(req,res){
        let html=await this.getTemplate('./Views/CRUD/read.html');
        let sql='SELECT masp,tensp,gia,soluong,hinhanh,mota from sanpham';
        let products=await this.getSQL(sql);
        console.log(products)

        let newHtml='';
        products.forEach((product,index)=>{
            newHtml+=`<tr>`
            newHtml+=`<td>${index+1}</td>`
            newHtml+=`<td>${product.tensp}</td>`
            newHtml+=`<td>${product.gia}</td>`
            newHtml+=`<td>${product.soluong}</td>`
            newHtml+=`<td><img width="150" height="150" src="/upload/${product.hinhanh}"</td>`
            newHtml+=`<td>${product.mota}</td>`
            newHtml+=`<td><a onclick="return confirm('Are you sure want to this product?')" href="/product/delete?masp=${product.masp}"  class="btn btn-danger">Delete</a>     <a href="/product/update?masp=${product.masp}" class="btn btn-primary">Update</a></td>`
            newHtml+=`</tr>`
        })
        html=html.replace('{product-list}',newHtml);
        res.write(html);
        res.end();
    }

    async addProduct(req,res){
        if(req.method==='GET'){
            let html=await this.getTemplate('./Views/CRUD/create.html');
            res.write(html);
            res.end();
        }else{
            let form=new formidable.IncomingForm();
            form.uploadDir='./upload/';
            form.parse(req,async(err,fields,files)=>{
                let newProduct={
                    name:fields.name,
                    price:fields.price,
                    quantity:fields.quantity,
                    img:files.img.originalFilename,
                    describe:fields.describe
                };
                let sql=`call createProduct('${newProduct.name}','${newProduct.price}','${newProduct.quantity}','${newProduct.img}','${newProduct.describe}')`;
                await this.getSQL(sql);
                let tmpPath = files.img.filepath;
                let desPath = form.uploadDir + files.img.originalFilename;
                fs.rename(tmpPath, desPath, (err) => {
                    if (err) console.log(err);
                });
                res.writeHead(301, { Location: "/product" });
                res.end();
            })
        };
    }

    async deleteProduct(req,res){
        let query=url.parse(req.url).query;
        let masp=qs.parse(query).masp;

        let sql=`Delete from sanpham where masp='${masp}'`;
        await this.getSQL(sql);
        res.writeHead(301,{Location:'/product'});
        res.end();
    }

    async updateProduct(req,res){
        let html=await this.getTemplate('./Views/CRUD/update.html');
        let query=url.parse(req.url).query;
        let masp=qs.parse(query).masp;
        let sql=`SELECT * FROM sanpham where masp=${masp}`;
        let data= await this.getSQL(sql);
        console.log(data)

        html=html.replace('{masp}',data[0].MaSP);
        html=html.replace('{tensp}',data[0].TenSP);
        html=html.replace('{gia}',data[0].Gia);
        html=html.replace('{soluong}',data[0].Soluong);
        html=html.replace('{hinhanh}',data[0].Hinhanh);
        html=html.replace('{mota}',data[0].Mota);
        res.write(html);
        res.end();
    };

    async updateProductList(req,res) {
        let query = url.parse(req.url).query;
        let masp = qs.parse(query).masp;

        let Form=new formidable.IncomingForm();
        Form.uploadDir='./upload/';
        Form.parse(req,async(err,fields,files)=>{
            let newProduct={
                name:fields.name,
                price:fields.price,
                quantity:fields.quantity,
                img:files.img.originalFilename,
                describe:fields.describe
            };
            let sql=`call updateProduct('${masp}','${newProduct.name}','${newProduct.price}','${newProduct.quantity}','${newProduct.img}','${newProduct.describe}')`;
            await this.getSQL(sql);

            let tmpPath = files.img.filepath;
            let desPath = Form.uploadDir + files.img.originalFilename;
            fs.rename(tmpPath, desPath, (err) => {
                if (err) console.log(err);
            });
            res.writeHead(301, { Location: "/product" });
            res.end();
        })
    };

};

module.exports=new Handle();