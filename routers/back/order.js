let express=require('express');
let router = express.Router();
const con = require('../../utils/conn');
const sd = require('silly-datetime');
let num = 10;
//订单
router.post('/getOrderList',(req,res)=>{
	let page = req.body.page;
	let search = req.body.search;
	let sql = `select *,(select COUNT(o_id) from ordergrop) as total from ordergrop
	 where (o_id like '%${search}%' or o_deli like '%${search}%') ORDER BY o_status  limit ${(page-1)*num},${num} `
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,total:result[0].total,code:20000})
		}
	})

})


router.post('/getOrderCom',(req,res)=>{
	let oid = req.body.oid;
	let sql = `select * from ordercom where o_id='${oid}'`
	console.log(sql,'getOrderCom');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,code:20000})
		}
	})

})

router.get('/editOrderItem/:oid',(req,res)=>{
	let oid = req.params.oid
	let time= sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	let sql = `update ordergrop set o_status=2,o_sendDate='${time}' where o_id='${oid}'`
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'发货完成',code:20000})
		
		}
	})

})

//商品
router.post('/getGoodList',(req,res)=>{
	let page = req.body.page;
	let search = req.body.search;
	let num = 8;
	let sql = `select *,(select COUNT(com_id) from commodity)  as total from commodity
	where(com_name like '%${search}%' or com_product_type like '%${search}%' or com_product_types like '%${search}%')
	limit ${(page-1)*num},${num} `
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,total:result[0].total,code:20000})
		}
	})

})

router.get('/delectGoodRow/:cid',(req,res)=>{
	let cid = req.params.cid
	let sql = `delete from commodity where com_id=${cid}`
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'删除成功',code:20000})
		}
	})

})

router.post('/editGoodRow',(req,res)=>{
	let row = req.body
	//console.log(row,'----------');
	let cid = row.com_id;
	let sql = `update commodity set com_name='${row.com_name}',com_oldprice='${row.com_oldprice}',com_price='${row.com_price}',
		com_description='${row.com_description}',com_num='${row.com_num}',com_animal='${row.animal}',
		com_product_type='${row.com_product_type}',com_product_types='${row.com_product_types}',
		com_msales='${row.com_msales}',com_imgs='${row.com_imgs}',com_authority='${row.com_authority}'
	where com_id='${cid}'`
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'修改完成',code:20000})
		}
	})

})


router.post('/addGoodRow',(req,res)=>{
	let row = req.body
	let sql=`insert into commodity  (com_animal,com_authority,com_description,com_imgs,com_msales,com_name,com_num,com_oldprice,
	com_price,com_product_type,com_product_types,com_synopsis) values
	('${row.com_animal}','${row.com_authority}','${row.com_description}','${row.com_imgs}','${row.com_msales}','${row.com_name}','${row.com_num}','${row.com_oldprice}',
	'${row.com_price}','${row.com_product_type}','${row.com_product_types}','${row.com_synopsis}')`
	console.log(sql,'addGoodRow-----')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'添加成功',code:20000})
		}
	})
})


//用户
router.post('/getUserList',(req,res)=>{
	let page = req.body.page;
	let search = req.body.search;
	let num = 8;
	let sql = `select *,(select COUNT(u_id) from user) as total from user where (u_name like '%${search}%' or u_phone like '%${search}%') limit ${(page-1)*num},${num}`
	console.log(sql,'getUserList');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,total:result[0].total,code:20000})
		}
	})
})

router.post('/editUserItem',(req,res)=>{
	let info = req.body
	let sql = `update user set u_name='${info.u_name}',u_password='${info.u_password}',u_phone='${info.u_phone}',
	u_address='${info.u_address}',u_icon='${info.u_icon}',u_sex='${info.u_sex}' where u_id='${info.u_id}' `
	console.log(sql,'editUserItem');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'修改成功',code:20000})
		}
	})
})

router.post('/deleteUserItem/:uid',(req,res)=>{
	let uid = req.params.uid
	let sql = `delete from user where u_id=${uid} `
	console.log(sql,'editUserItem');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'删除失败',code:500})
		}else{
			res.send({msg:'删除成功',code:20000})
		}
	})
})

//视频
router.post('/getVideoList',(req,res)=>{
	let page = req.body.page;  
	let search = req.body.search;
	let num = 9;
	let sql = `select *,(select COUNT(v_id) from videos)  as total from videos
	where(v_name like '%${search}%' or v_type like '%${search}%') limit ${(page-1)*num},${num} `
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,total:result[0].total,code:20000})
		}
	})
})

router.get('/deleteVideoItem/:vid',(req,res)=>{
	let vid = req.params.vid
	let sql = `delete from videos where v_id=${vid} `
	console.log(sql,'deleteVideoItem');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'删除失败',code:500})
		}else{
			res.send({msg:'删除成功',code:20000})
		}
	})
})

router.post('/addVideoItem',(req,res)=>{
	let row = req.body
	let sql=`insert into videos  (v_name,v_see,v_img,v_url,animal,v_type) values
	('${row.v_name}','0','${row.v_img}','${row.v_url}','${row.animal}','${row.v_type}')`
	console.log(sql,'addVideoItem-----')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'添加成功',code:20000})
		}
	})
})

router.post('/editVideoItem',(req,res)=>{
	let row = req.body
	let vid=row.vid
	let sql = `update videos set v_name='${row.v_name}',v_img='${row.v_img}',v_url='${row.v_url}',
		animal='${row.animal}',v_type='${row.v_type}' 
	where v_id='${vid}'`
	console.log(sql,'editVideoItem-----')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'修改成功',code:20000})
		}
	})
})

//关于
router.post('/getAboutList',(req,res)=>{
	let page = req.body.page;  
	let search = req.body.search;
	let num = 6;
	let sql = `select *,(SELECT	COUNT(Ac_id) FROM aboutcontent,aboutinfo WHERE Abcon_id = Ab_id) AS total from aboutcontent,aboutinfo
	where(Ac_title like '%${search}%' and Abcon_id=Ab_id) order by Abcon_id limit ${(page-1)*num},${num} `
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,total:result[0].total,code:20000})
		}
	})

})

router.get('/deleteAboutItem/:acid',(req,res)=>{
	let acid = req.params.acid
	let sql = `delete from aboutcontent where Ac_id=${acid} `
	console.log(sql,'deleteAboutItem');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'删除失败',code:500})
		}else{
			res.send({msg:'删除成功',code:20000})
		}
	})
})

router.post('/editAboutItem',(req,res)=>{
	let row = req.body
	let Ac_id=row.Ac_id
	let sql = `update aboutcontent set Ac_title='${row.Ac_title}',Ac_img='${row.Ac_img}',Ac_content='${row.Ac_content}',
		Ac_body='${row.Ac_body}',Abcon_id='${row.Abcon_id}' 
	where Ac_id='${Ac_id}'`
	console.log(sql,'editAboutItem-----')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'修改成功',code:20000})
		}
	})
})

router.post('/addAboutItem',(req,res)=>{
	let row = req.body
	let sql = `insert into aboutcontent  (Ac_title,Ac_see,Ac_img,Ac_content,Ac_body,Abcon_id) values
	('${row.Ac_title}','0','${row.Ac_img}','${row.Ac_content}','${row.Ac_body}','${row.Abcon_id}')`
	console.log(sql,'addAboutItem-----')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({msg:'添加成功',code:20000})
		}
	})
})




module.exports = router;