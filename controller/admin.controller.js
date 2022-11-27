const {Router}=require('express');
const Admin=require('../model/admin');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');


const router=Router();

exports.signup= async(req,res)=>{

    const admin=req.body;

    //check if email is already registered
    const oldAdmin=await Admin.findOne({email:admin.email});
    if(oldAdmin){
        return res.status(409).json({message:'Admin already exist. Please login.'})
    }

    //if not then create a new admin with the given data
    try{
        const newAdmin=new Admin({... admin})
        const data=await newAdmin.save();
        res.json(data);

    }catch(err){
        let errors={};
        console.log(err.message);
        for(let e in err.errors){
            errors[e]=err.errors[e].message;
        }
        res.status(400).json(errors);
    }   
}

exports.signin=async (req,res)=>{

    if(!(req.body.email && req.body.password)){
        return res.status(401).json({message:"Email and password are required."});
    }

    //
    const admin=await Admin.findOne({email:req.body.email});

    if(!admin){
        return res.status(401).json({message:"Email or password is wrong."});
    }

    //check if password matches
    if(!await bcrypt.compare(req.body.password, admin.password)){
        return res.status(401).json({message:"Email or password is wrong."});
    }

    //creating a new jwt token
   const token= jwt.sign(
        { admin_id:admin._id,email:admin.email},
        process.env.SECRET_KEY,
        {
            expiresIn:'30d',
        });

    res.status(201).json({token})
}