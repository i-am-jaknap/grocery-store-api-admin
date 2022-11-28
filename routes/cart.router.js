const {Router}= require('express');
const cartController=require('../controller/cart.controller');
const auth = require('../middleware/auth');


const router=Router();

router.use(auth);

//get all the items of the cart
router.get("/",cartController.fetch);

//get all item by its cart item id
router.get("/:value",cartController.fetch);


router.use((err,req,res,next)=>{
    res.status(500).json({errno:err.errno,message:err.message});
})

module.exports=router;