const {Router}= require('express');
const cartController=require('../controller/cart.controller');


const router=Router();

//get all the items of the cart
router.get("/",cartController.fetch);

//get all item by its cart item id
router.get("/:value",cartController.fetch);




module.exports=router;