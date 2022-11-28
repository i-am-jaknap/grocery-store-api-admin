const User = require('../model/user');


exports.fetch=async(req,res,next)=>{
    const using=req.query.using || 'all';
    const value=req.params.value;



    if(!value && using.toLocaleLowerCase()==='all'){
        try{
            const users= await User.find({},{orders:0,cart:0});
                return res.status(200).json(users);
        }catch(err){
            return res.status(500).json({message:"Something went wrong."});
        }

    }else if(value && using.toLocaleLowerCase()==='email'){
        try{
            const user= await User.findOne({email:value},{orders:0,cart:0});
            if(user){
                return res.status(200).json(user);
            }
            return res.status(204).json({message:"Invalid email."});

        }catch(err){
            console.log(err);
            return res.status(500).json({message:"Something went wrong."});
        }
    }

    next();
   
}

exports.update=async (req,res)=>{
    const action=req.query.action || 'block_user';
    const email=req.params.email;

    try{
        if(!action || action.toLocaleLowerCase() ==='block_user'){
           const updateUser=await User.findOneAndUpdate({email:email},{$set:{status:false}},{new:true}).select({orders:0,cart:0});
           return res.json(updateUser);
        }else if(action ==='unblock_user'){
            const updateUser=await User.findOneAndUpdate({email:email},{$set:{status:true}},{new:true}).select({orders:0,cart:0});
            return res.json(updateUser);
        }
    }catch(err){
        return res.status(500).json({message:"Something went wrong!"});
    }
}
