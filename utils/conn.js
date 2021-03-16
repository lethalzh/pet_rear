var mysql = require('mysql');
var con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    database: 'petdata'
});

con.connect((err) => {
    if (err) {
        console.log("连接失败")
    } else {
        console.log("连接成功")
    }
})
module.exports = con;