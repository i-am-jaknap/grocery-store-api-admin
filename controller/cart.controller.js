const Cart=require('../model/cart');
const User=require('../model/user');


//get the cart either the the cart of all the users or 
//the cart of particular user
exports.fetch=async(req,res,next)=>{
          
      //email address
      const email=req.params.value;

      //finding and sending the product of a cart  by using user email
    if( email ){
        try{
            const cart= await User.findOne({email:email})
                                    .select({"cart.createdAt":0,"cart.updatedAt":0,"cart._id":0});
            
            //check if the user is valid or not
            if(cart){
               return res.status(200).json(cart.cart);  
            }

            return res.status(404).json({message:"invalid email."});  
             
        }catch(err){
          return   next(err);
        }
    }

    //otherwise fetch all the product from the cart
    try{
        const cart=await Cart.find({},{createdAt:0,updatedAt:0,_id:0})
                            .sort({createdAt:-1,updatedAt:-1})
                            .select();;
        return res.status(200).json(cart);  
    }catch(err){
        return next(err);
    }


}