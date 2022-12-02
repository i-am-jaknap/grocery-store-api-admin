const User = require('../model/user');


exports.fetch=async(req,res,next)=>{
    const using=req.query.using || 'all';
    const value=req.params.value;



    if(!value && using.toLocaleLowerCase()==='all'){
        try{
            const users= await User.find({},{orders:0,cart:0})
                                    .sort({createdAt:-1,updatedAt:-1})
                                    .select({createdAt:0,updatedAt:0});

                return res.status(200).json(users);
        }catch(err){
            return res.status(500).json({message:"Something went wrong."});
        }

    }else if(value && using.toLocaleLowerCase()==='email'){
        try{
            const user= await User.findOne({email:value},{orders:0,cart:0})
                                    .sort({createdAt:-1,updatedAt:-1})
                                    .select({createdAt:0,updatedAt:0});
                                    
            if(user){
                return res.status(200).json(user);
            }
            return res.status(404).json({message:"Invalid email."});

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
           await User.findOneAndUpdate({email:email},{$set:{status:false}},{new:true})
           return res.status(200).json({message:"User blocked."});

        }else if(action ==='unblock_user'){
           const updateUser=await User.findOneAndUpdate({email:email},{$set:{status:true}},{new:true});
           return res.status(200).json({message:"User unblocked."});
        }
    }catch(err){
        return res.status(500).json({message:"Something went wrong!"});
    }
}
