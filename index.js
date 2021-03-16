
var path = require('path');
var querystring = require('querystring')
var cookieParser = require('cookie-parser');
var body=require('body-parser');
var moment = require('moment');

var userRouter=require('./routers/user/user')
var homeRouter=require('./routers/user/home')
var productRouter=require('./routers/products/products')

var express = require('express');
var cors=require("cors")
var app = express();


app.use(cors())
app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(cookieParser());



// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });
app.use('/',homeRouter)
app.use('/user',userRouter)
app.use('/products',productRouter)


const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;