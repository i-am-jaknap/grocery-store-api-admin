const {Router}=require('express');
const productRouter=require('./product.router');
const adminRouter=require('./admin.router');
const orderRouter=require('./order.router')
const cartRouter=require('./cart.router')


const router=Router();


router.get('/',(req,res)=>{
    res.send('Hello world');
})

router.use('/',adminRouter);
router.use('/product',productRouter);
router.use('/order',orderRouter);
router.use('/cart',cartRouter);


module.exports=router;



