const fs=require('fs');
const connection = require("../../Model/Database/Database");


class BaseHandle{
    async getTemplate(pathName){
        return new Promise((resolve, reject)=>{
            fs.readFile(pathName,'utf-8',(err, data)=>{
                if(err) reject(err);
                else resolve(data);
            })
        })
    }


    async getSQL(sql){
        return new Promise((resolve, reject)=>{
            connection.query(sql,(err,result)=>{
                if(err) reject(err);
                else resolve(result);
            })
        })
    }
};

module.exports=BaseHandle;