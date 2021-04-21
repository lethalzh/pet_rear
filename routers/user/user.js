let express=require('express');
let router = express.Router();
let md5 = require('md5-node');
let con = require('../../utils/conn');
let JWT = require('../../utils/jwt.js')

router.post('/Admin_login',(req,res)=>{
	
	 let username = req.body.username;
	 let password = req.body.password;
	let sql  = `select * from user where u_name='${username}'`
	 console.log(req.body,'-------',sql);
	res.send({code:20000,msg:'failure',data:'用户不存在！！'})
})

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
	con.query(sql,(err,result)=>{
		if(err){
			res.send({data:'用户名重复',msg:'failure'})
		}else{
			res.send({data:'创建成功',msg:'success'})
		}
	})
})

router.post('/getaddress',(req,res)=>{
    let u_id = req.body.id
    let sql = `select * from address where u_id=${u_id}`
	con.query(sql,(err,result)=>{
		if (err) {
			res.send({msg:'failure'});
		} else{
			for(let i of result){
				i.add_arrs=i.add_arrs.split(',')
			}
			res.send({msg:'success',data:result});
		}
	})
	
})
router.post('/delectaddress',(req,res)=>{
	let add_id = req.body.add_id;
	let sql = `delete from address where add_id=${add_id}`
	console.log(sql,'sql')
	con.query(sql,(err,result)=>{
		if(err){
				res.send({msg:'failure',data:'删除失败！！'})
		}else {
			res.send({msg:'success',data:'删除成功'})
		}
	})
})
router.post('/addaddress',(req,res)=>{
    let id = req.body.id
	let data = req.body.data
	let sql = `insert into address (u_id,add_name,add_arrs,add_address,add_number,add_flag) 
	values(${id},'${data.add_name}','${data.add_arrs}','${data.add_address}','${data.add_number}','${data.add_flag}')`
	console.log(sql,'sql')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',data:'添加地址失败！！'})
		}else{
			res.send({msg:'success',data:'添加地址成功'})
		}
	})
})

router.post('/editaddress',(req,res)=>{
    let id = req.body.id
	let aid= req.body.aid
	let data = req.body.data
	let sql = `update address set add_name='${data.add_name}',add_arrs='${data.add_arrs}',add_address='${data.add_address}',add_number='${data.add_number}',add_flag='${data.add_flag}'
	 where u_id=${id} and add_id=${aid}`
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',data:'地址修改失败！！'})
		}else{
			res.send({msg:'success',data:'地址修改成功'})
		}
	})
})

router.post('/getorder',(req,res)=>{
	let u_id = req.body.id;
	let state = req.body.state;
	let select = req.body.select;
	let str=''
	let sql = `select * from ordergrop,ordercom,address where ordergrop.u_id=${u_id} and 
	ordercom.o_id=ordergrop.o_id and address.add_id=ordergrop.a_id and (ordergrop.o_id like '%${select}%' or ordercom.com_name like '%${select}%' )` 
	if(state==0){
		str = 'order by ordergrop.o_status';
	}else{
		str = ` and ordergrop.o_status='${state}'`
	}
	sql=sql+str;
	// console.log(sql,'-----------getorder')
	let Mydata=[];
	con.query(sql,async (err,ordergrops)=>{
		if(err){
			res.send({msg:'failure',data:'查找订单异常！！'})
		}else{
			
			let arr=[];
			if(ordergrops.length!=0){
				let o_id=ordergrops[0].o_id;
				for(let order of ordergrops){
					if(order.o_id==o_id){
						arr.push(order)
					}else{
						Mydata.push({aa:arr})
						o_id=order.o_id
						arr=[]
						arr.push(order)
					}
				}
			}
			Mydata.push({aa:arr})
		res.send({msg:'success',data:Mydata,flag:ordergrops.length!=0})	
		}
			
	})
	
	
})

router.post('/getcartnum',(req,res)=>{
	let u_id = req.body.id
	let sql = `select count(s_id) as num from shoppcart where u_id = ${u_id}`
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',data:'购物车商品数数量异常！！'})
		}else{
			console.log(result[0],'-----------getcartnum')
			res.send({msg:'success',data:result[0].num})	
		}
	})
})

module.exports = router;
