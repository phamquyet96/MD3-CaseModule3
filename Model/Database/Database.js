const mysql=require('mysql');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'md3',
    charset:'utf8_general_ci'
});

module.exports=connection;