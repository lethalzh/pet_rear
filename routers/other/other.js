let express=require('express');
let router = express.Router();
	
const fs = require('fs')
const path = require('path')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const con = require('../../utils/conn');
const {catAboutInfo} = require('../../assets/data/NavData.js');
const {dogAboutInfo} = require('../../assets/data/NavData.js');
let md5 = require('md5-node');
const sd = require('silly-datetime');



router.post('/upload', multipartMiddleware, function(req, res){
	//console.log(req.files.file,'---')
	fs.readFile(req.files.file.path,(err,data)=>{
	    //如果读取失败
	    if(err){return res.send('上传失败')}
	    //如果读取成功
	    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
	    let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222);
	    //拓展名
	    let extname = req.files.file.type.split('/')[1]
	    //拼接成图片名
	    let keepname = time+'.'+extname
	    //三个参数
	    //1.图片的绝对路径
	    //2.写入的内容
	    //3.回调函数
		let upPath=path.resolve(".")
	    fs.writeFile(path.join(upPath,'/public/img/'+keepname),data,(err)=>{
	        if(err){return res.send('写入失败')}
	        res.send({code:20000,msg:'上传ok',url:keepname})
	    });      
	})
})


router.post('/getVideoList',(req,res)=>{
	let animal = req.headers.animal;
	let sql = `select * from videos where animal='${animal}'`
	
	con.query(sql,(err,result)=>{
		//console.log(sql,'getVideoList------------',result)
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({data:result,msg:'success'})
		}
	})
})


router.get('/getAboutInfo/:mode',(req,res)=>{
	let mode = req.params.mode
	let animal = req.headers.animal;
	let sql=''
	if(mode=='true'){
		sql = `select * from aboutInfo,aboutContent where aboutInfo.Con_id=aboutContent.Abcon_id and animal='${animal}' order by aboutContent.Abcon_id`
	}else{
		sql = `select * from aboutInfo where animal='${animal}'`
	} 
		console.log(sql,'sql---------')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({data:result,msg:'success'})
		}
	})
	// if(animal=='dog'){
	// 	res.send({data:dogAboutInfo,msg:'success'})
	// }else{
	// 	res.send({data:catAboutInfo,msg:'success'})
	// }
	
	
})


router.post('/getuserInfo',(req,res)=>{
	let uid = req.body.uid
	let sql = `select * from user where u_id=${uid}`
	console.log(sql,'getuserInfo----------------')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({data:result[0],msg:'success'})
		}
	})
})

router.post('/EdituserInfo',(req,res)=>{
	let uid = req.body.uid
	let userInfo = req.body.userInfo
	let sql = `update user set u_icon='${userInfo.u_icon}',u_name='${userInfo.u_name}',u_phone='${userInfo.u_phone}',u_sex=${userInfo.u_sex} where u_id=${uid}`
	console.log(sql,'EdituserInfo----------------')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({msg:'success'})
		}
	})
})

router.post('/EditPassword',(req,res)=>{
	let uid = req.body.uid
	let newPass = req.body.newPass
	let pass = md5(newPass)
	let sql = `update user set u_password='${pass}' where u_id=${uid}`
	console.log(sql,'EditPassword')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({msg:'success'})
		}
	})
	
})
module.exports = router;