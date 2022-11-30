const mongoose =require('mongoose');
const bcrypt=require('bcrypt')


const Schema = mongoose.Schema;



const adminSchema=new Schema({
      firstname:{
        type:String,
        require:[true,'First name is required.'],
        lowercase:true,
        trim:true,
    },
    lastname:{
        type:String,
        require:[true,'Last name is required.'],
        lowercase:true,
        trim:true,
    },
    email:{
        type:Schema.Types.String,
        require:[true,'Email is required.'],
        unique:true,
        lowercase:true,
        match:[/.+\@.+\..+/, 'Invalid email.'],
        trim:true,
    },
    password:{
        type:String,
        minLength:[8,'Password should be at least 8 letters long.'],
        maxLength:[30,'Password should be at most 30 letters long'],
        required:[true,'Password is required.'],
    },

},{versionKey:false,timestamps:true});

adminSchema.pre('save',  function(next){

    if(!this.isModified('password')){
        return next();
    } 
    const admin = this;

    bcrypt.genSalt(10, async function(err, salt){
        if (err){ return next(err) }

        try{
            const hash= await bcrypt.hash(admin.password, salt);
            admin.password = hash;
            return  next();
        }catch(err){
            return next(err);
        }
    })
})

module.exports=mongoose.model('Admin',adminSchema);