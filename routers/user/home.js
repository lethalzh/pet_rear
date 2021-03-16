let express=require('express');
let router = express.Router();
let con = require('../../utils/conn');
let titlesDog = require('../../assets/data/NavData.js')
router.get('/products_num', function(rep,res) {
	let animalDog='dog',animalCat='cat' , products_num={cat:1234,dog:65321};
	
		 res.send({products_num,status:200,msg:'success'})
    // let sqli = "select * from cs";
    //     con.query(sqli, (err, result) => {
    //         if (err) {
    //             callback(err);
    //         } else {
    //             for (let em of result) {
    //                 let record = [em['aa']];
    //                 mydata.push(record);
    //             }
    //             console.log(mydata);
    //             res.send({data:mydata,status:200,msg:'success'})
    
    //         }
    //     });
});


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

router.get('/navdata/:ain',(rep,res)=>{
	res.send({data:titlesDog,msg:'success'})
})
module.exports = router;
