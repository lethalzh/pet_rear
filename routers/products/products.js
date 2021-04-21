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
	let pageStr=` limit ${(page-1)*num},${num}`
	let searArr = req.body.search.split('+');
	let animal = req.headers.animal;
	let str=''
	for(let i of searArr){
		 str += ` (com_name like '%${i}%' or com_product_type like '%${i}%' or com_product_types like '%${i}%' or com_brand like '%${i}%') and`
	}
	str = str.substr(0,str.length-3)
	let sqlCount = `select count(*) as total from commodity where com_animal='${animal}' and (${str}) ${orderBy}`
	let sqlAll = `select * from commodity where com_animal='${animal}' and (${str}) ${orderBy}${pageStr}`
	//console.log(sqlAll,'sqlall')
	con.query(sqlCount,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			con.query(sqlAll,(er,re)=>{
				if(err){
					res.send({msg:'failure'})
				}else{
					let sArr=[]
					for(let i  of re){
						let arr = i.com_name.split(' ')
						i.com_brand=arr[0].replace(/\s*【.*?】/g,'')
						sArr.push(arr[0].replace(/\s*【.*?\】/g,''))
						// console.log(i.com_brand,'---------------------------')
					}
				
					 // console.log(re,'resultresultresultresultresult',[...new Set(sArr)] )
					res.send({total:result[0].total,data:re,msg:'success',brands:[...new Set(sArr)]})
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
	let sql = `SELECT shoppcart.c_id,s_id,com_oldprice,com_price,com_num,com_name,com_imgs,shoppcart.s_num 
	FROM commodity,	shoppcart 
	WHERE	(shoppcart.c_id = commodity.com_id AND shoppcart.u_id=${uid})`
	
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

router.get('/getcart/:oid',(req,res)=>{
	let oid = req.params.oid
	let sql = `select * from ordercom where o_id = ${oid}`
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',data:''})
		}else{
			console.log(result,'getcart')
			res.send({msg:'success',data:result})
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
	let deli = req.body.deli
	let id = req.body.id
	let aid = req.body.add_id
	let oid = updatetimes
	let status=req.body.status
	// console.log(commodity,totalPrice,id,'------------------------',updatetimes)
	let sqlInsert = `INSERT into orderGrop (o_id,u_id,a_id,o_createDate,o_status,o_totalPrice,o_deli) VALUES ('${oid}',${id},${aid},'${time}',${status},${totalPrice},'${deli}')`
	console.log(sqlInsert,'sqlInsert----------')
	 con.query(sqlInsert,(err,result)=>{
		 if(err){
			res.send({msg:'failure'})
		 }else{
			for(let it of commodity){
				let sql = `INSERT into ordercom (c_id,o_id,u_id,com_name,s_num,com_price,com_imgs,com_oldprice) VALUES ('${it.c_id}','${oid}',${id},'${it.com_name}',${it.s_num},${it.com_price},'${it.com_imgs}',${it.com_oldprice})`
				console.log(sql,'sql----------')
				con.query(sql,(er,re)=>{
					if(er) res.send({msg:'failure'})
				})
			}
				res.send({msg:'success'})
		 }
	 })

	
})

router.post('/setOrder',(req,res)=>{
	let oid=req.body.oid;
	let time= sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let sql = `update ordergrop set o_finishDate='${time}',o_status=3 where o_id='${oid}'`
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({msg:'success'})
		}
	})
	
})

router.post('/getHotList',(req,res)=>{
	let animal=req.headers.animal;
	let sql = `SELECT * FROM commodity WHERE com_animal = '${animal}' ORDER BY	com_msales desc LIMIT 6`
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure'})
		}else{
			res.send({msg:'success',data:result})
		}
	})
})

module.exports = router;