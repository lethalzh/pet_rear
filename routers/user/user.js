let express=require('express');
let router = express.Router();
let md5 = require('md5-node');
let con = require('../../utils/conn');
let JWT = require('../../utils/jwt.js')

router.post('/login',(req,res)=>{

    let name = req.body.name;
	let Password=req.body.password;
	let sql  = `select * from user where u_phone='${name}'`
	con.query(sql,(err,result)=>{
		if (err) {
		  //  callback(err);
			res.send({status:500,msg:'failure',data:'用户不存在！！'})
		} else {
				if(md5(Password)==result[0].u_password){
					const jwt = new JWT
					let token = jwt.generate({name:name,password:Password}, '86400s');
					let info = jwt.verify(token); //token信息 
					console.log(token);
					console.log(info);
					// setTimeout(() => {                                                                                                   
					//   console.log('检验过期token');
					//   let info2 = jwt.verify(token);
					//   console.log(info2); // false
					// }, 13000);
					 res.send({msg:'success',data:{name:result[0].u_name,id:result[0].u_id},token:token});
				}else{
					res.send({msg:'failure',data:'密码错误！！'});
				}
		  
		    }
	})
	
	
	
})
router.post('/register',(req,res)=>{
    let postData=req.body;
	postData.password=md5(postData.password);
	let sql = `insert into user (u_name,u_password,u_address,u_phone) values ('${postData.name}','${postData.password}','${postData.address}','${postData.phone}')`
	console.log(sql,'----')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({data:'用户名重复',msg:'failure'})
		}else{
			res.send({data:'创建成功',msg:'success'})
		}
	})
})


router.get('/:id',(req,res)=>{
    let id = req.params.id
    res.send('登录页面c'+id);
})

module.exports = router;
