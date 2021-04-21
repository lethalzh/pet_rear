let express=require('express');
let router = express.Router();
let con = require('../../utils/conn');
let {titlesDog,titlesCat} = require('../../assets/data/NavData.js')
let {homeHotCat,homeHotDog} = require('../../assets/data/NavData.js')
let moment = require('moment');

router.get('/products_num', function(rep,res) {
	let animalDog='dog',animalCat='cat' , products_num={cat:0,dog:0};
	let sql =`select count(com_id) as num from commodity group by com_animal` 
	console.log(sql,'products_num');
	  con.query(sql,(err, result) => {
		  if(err){
			    res.send({code:500,msg:'failure'})
		  }else{
			  products_num.cat=result[0].num
			  products_num.dog=result[1].num
			  res.send({products_num,code:20000,msg:'success'})
		  }
	  })
	
    
});

router.get('/getVideoConnum',(req,res)=>{
	let sql =`select sum(v_see) as num,animal,v_type from videos group by v_type,animal ORDER BY animal,v_type`
	con.query(sql,(err,result)=>{
		if(err){
			res.send({code:500,msg:'failure'})
		}else{
			res.send({data:result,code:20000})
		}
	})
})

router.get('/getSumGoods',(req,res)=>{
	let sql = `select sum(com_msales) as num,com_product_type,com_animal from commodity group by com_product_type,com_animal ORDER BY com_animal,com_product_type`
	console.log(sql,'-getSumGoods')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({code:500,msg:'failure'})
		}else{
			res.send({data:result,code:20000})
		}
	})
})

router.get('/getSumOrderPrice',(req,res)=>{
	let sql =`
	SELECT temp.days,IFNULL(odata.wPrice,0) as wPrice,IFNULL(odata.fPrice,0) as fPrice from(
	
	SELECT curdate() as days 
	union all
	SELECT date_sub(curdate(), interval 1 day) as days
	union all
	SELECT date_sub(curdate(), interval 2 day) as days
	union all
	SELECT date_sub(curdate(), interval 3 day) as days
	union all
	SELECT date_sub(curdate(), interval 4 day) as days
	union all
	SELECT date_sub(curdate(), interval 5 day) as days
	union all
	SELECT date_sub(curdate(), interval 6 day) as days ) as temp
	
	left join
	(
	SELECT
			SUM(CASE WHEN o_status>0 THEN o_totalPrice else 0 end) AS wPrice,
			SUM(CASE WHEN o_status<0 THEN o_totalPrice else 0 end) AS fPrice,
		  DATE(o_createDate) AS date,o_createDate
	FROM
		ordergrop
	GROUP BY
		DATE(ordergrop.o_createDate)
	) as odata on temp.days= odata.date order by temp.days
`
	console.log(sql,'-getSumOrderPrice')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({code:500,msg:'failure'})
		}else{
			for(let i of result){
				i.days= moment(i.days).format('YYYY-MM-DD')
			}
			res.send({data:result,code:20000})
		}
	})
	
})

router.get('/getPanelGroup',(req,res)=>{
	let sql = `
	SELECT
		(SELECT COUNT(user.u_id) from user) AS ucount,
		(SELECT COUNT(com_id) from commodity) AS ccount,
		(SELECT COUNT(CASE WHEN o_status>0 THEN 1 else 0 end) FROM ordergrop)AS wcount,
		(SELECT sum(CASE WHEN o_status>0 THEN o_totalPrice else 0 end) FROM ordergrop 
		where date(o_createDate) = curdate() )AS fprice
	`
	console.log(sql,'getPanelGroup')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({code:500,msg:'failure'})
		}else{
			// for(let i of result){
			// 	i.days= moment(i.days).format('YYYY-MM-DD')
			// }
			res.send({data:result,code:20000})
		}
	})
	
})

router.get('/carousel',(rep,res)=>{
	let sqli = "select * from Carousel";
	let mydata = [];
	    con.query(sqli, (err, result) => {
	        if (err) {
	          //  callback(err);
				res.send({status:500,msg:'failure',err:err})
	        } else {
	            for (let em of result) {
	                let record = {cid:em['c_id'],cimg:em['c_img'],clink:em['c_link'],ccolor:em['c_color']};
	                mydata.push(record);
	            }
	            // console.log(mydata);
	            res.send({data:mydata,status:200,msg:'success'})
			}
	})
})

router.get('/navdata/:ain',(req,res)=>{
	let animal = req.params.ain;
	let data;
	if(animal=='dog')
		data=titlesDog
	else 
		data = titlesDog//titlesCat
	res.send({data:data,msg:'success',code:20000})
})

router.get('/getHomeBody',(req,res)=>{
	let animal = req.headers.animal;
	let data
	if(animal=='dog')
		data = homeHotDog
	else 
		data = homeHotCat
	let sql = `
		 SELECT
			*
		 FROM
			commodity t
		 WHERE
			(
				SELECT
					COUNT(1)
				FROM
					commodity
				WHERE
					com_product_type = t.com_product_type
				AND com_msales >= t.com_msales 
			) <= 8 
		 AND
			com_animal='${animal}'
	`
	//console.log(sql,'getHomeBody-----------')
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',err:err})
		}else{
			let len = data.length,j=0
			let obj = {
				com_id:-1
			}
			for(let da in data){
				let infos=[]
				for(let i=1;i<=8;i++) {
					if(result[j+1])
						infos.push(result[j++])
					else
						infos.push(obj)
				}
				// console.log(infos,'---------------')
				data[da].arr=infos
			}
			
			res.send({data:data,msg:'success'})
		}
	})
	// console.log(sql , 'sql --------------')
	//res.send({data:data,msg:'success'})
})
module.exports = router;
