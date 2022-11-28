const {Router}=require('express');
const userController=require('../controller/user.controller');
const auth = require('../middleware/auth');

const router=Router();

router.use(auth);

router.get('/',userController.fetch);
router.get('/:value',userController.fetch);
router.put('/:email',userController.update);

router.use((err,req,res,next)=>{
    res.status(500).json({errno:err.errno,message:err.message});
});

module.exports=router;