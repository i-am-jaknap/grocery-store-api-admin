const {Router}=require('express');
const {signup,signin}=require('../controller/admin.controller');

const router=Router();

router.post('/signin',signin);
router.post('/signup',signup);


router.use((err,req,res,next)=>{
    res.status(500).json({errno:err.errno,message:err.message});
})

module.exports=router;