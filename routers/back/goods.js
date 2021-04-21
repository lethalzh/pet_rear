
let express=require('express');
let router = express.Router();
const con = require('../../utils/conn');
const sd = require('silly-datetime');

router.get('/getGoodList',(req,res)=>{
	let sql = `select * from commodity`
	console.log(sql,'sql--------');
	con.query(sql,(err,result)=>{
		if(err){
			res.send({msg:'failure',code:500})
		}else{
			res.send({data:result,code:20000})
		}
	})

})


module.exports = router;