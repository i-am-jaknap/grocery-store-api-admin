const {Router}=require('express');
const {signup,signin}=require('../controller/admin.controller');

const router=Router();

router.post('/signin',signin);
router.post('/signup',signup);


module.exports=router;