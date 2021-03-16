let express=require('express');
let router = express.Router();
const con = require('../../utils/conn');
const sd = require('silly-datetime');


router.post('/productList',(req,res)=>{
	
	let flag = req.body.flag
	let orderBy=''
	if(flag==1)
		orderBy='order by com_msales desc'
	else if(flag==2)
		orderBy='order by com_price'
	let page = 	req.body.page
	let num = 12
	let pageStr=` limit ${(page-1)*num},${page*num}`
	let searArr = req.body.search.split(' ');
	let animal = req.headers.animal;
	let str=''
	for(let i of searArr){
		 str += ` com_name like '%${i}%' or com_product_type like '%${i}%' or com_product_types like '%${i}%' or com_brand like '%${i}%' or`
	}
	str = str.substr(0,str.length-2)
	let sqlCount = `select count(*) as total from commodity where com_animal='${animal}' and (${str}) ${orderBy}`
	let sqlAll = `select * from commodity where com_animal='${animal}' and (${str}) ${orderBy}${pageStr}`
	  // console.log(sqlAll,'----------')
	con.query(sqlCount,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			con.query(sqlAll,(er,re)=>{
				if(err){
					res.send({msg:'failure'})
				}else{
					 // console.log(result,re,'resultresultresultresultresult')
					res.send({total:result[0].total,data:re,msg:'success'})
				}
			})
			
		}
	})
		
})

router.get('/:pid',(req,res)=>{
		let pid =  req.params.pid;
		let sql = `select * from commodity where ${pid}=com_id`
		// console.log(sql,'----')
		con.query(sql,(err,result)=>{
			if(err){
				res.send({msg:'failure'})
			}else{
				let data = result[0]
				res.send({data:data,msg:'success'})
			}
		})
})
router.post('/cart',(req,res)=>{
	let uid = req.body.id;
	let sql = `SELECT s_id,com_price,com_name,com_imgs,shoppcart.s_num 
	FROM commodity,	shoppcart 
	WHERE	shoppcart.c_id = commodity.com_id AND shoppcart.u_id=${uid}`
	// console.log(sql,'---------------------')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			var arr = [];
		
			for(let em of result){
				arr.push(em)
			}
			res.send({data:arr,msg:'success'})
		}
	})
	
})

router.post('/addCart',(req,res)=>{
	let body = req.body;
	var sql;
    let sqlSelect = `select count(s_id) as coun from shoppcart where u_id=${body.id} and c_id=${body.com_id}`
	con.query(sqlSelect,async (er,re)=>{
		if(er){
			console.log(er,'eeeeeeeeeeeeeeee')
		}else{
			if(re[0].coun!=0)
				sql = `update shoppcart set s_num=s_num+${body.num} where u_id=${body.id} and c_id=${body.com_id}`
			else
				sql = `INSERT INTO shoppcart (u_id,c_id,s_num,address) VALUES (${body.id},${body.com_id},${body.num},'${body.address}')`

		}
		await	con.query(sql,(err,result)=>{
				   if(err){
					   res.send({msg:'failure'})
				   }else{
					   res.send({msg:'success'})
				   }
			})
	})
		
})

router.get('/cart_delect/:did',(req,res)=>{
	let did= req.params.did;

	let sql = `delete from shoppcart where s_id = ${did}`
	con.query(sql,(err,result)=>{
		   if(err){
			   res.send({msg:'failure'})
		   }else{
			   res.send({msg:'success'})
		   }
	})
})

router.post('/settlement',(req,res)=>{
	let updatetimes = sd.format(new Date(), 'YYYYMMDDHHmmss');
	let time= sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let commodity = req.body.commodity
	let totalPrice = req.body.totalPrice
	let id = req.body.id
	let oid = updatetimes
	// console.log(commodity,totalPrice,id,'------------------------',updatetimes)
	let sqlInsert = `INSERT into orderGrop (o_id,u_id,o_createDate,o_status,o_totalPrice) VALUES ('${oid}',${id},'${time}','start',${totalPrice})`
	console.log(sqlInsert,'sqlInsert----------')
	 con.query(sqlInsert,(err,result)=>{
		 if(err){
			res.send({msg:'failure'})
		 }else{
			for(let it of commodity){
				let sql = `INSERT into ordercom (o_id,u_id,com_name,com_num,com_price) VALUES ('${oid}',${id},'${it.com_name}',${it.s_num},${it.com_price})`
				console.log(sql,'sql----------')
				con.query(sql,(er,re)=>{
					if(er) res.send({msg:'failure'})
				})
			}
				res.send({msg:'success'})
		 }
	 })

	
})
module.exports = router;