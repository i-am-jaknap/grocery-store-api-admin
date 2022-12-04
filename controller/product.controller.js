const PickHandler=require('../lib/pick_handler');
const Product = require('../model/product')
const getDeleter=require('../lib/file_deleter');

const  { GOOGLE_CLOUD_PRIVATE_KEY ,GOOGLE_CLOUD_BUCKET_NAME,
    GOOGLE_CLOUD_CLIENT_EMAIL,GOOGLE_CLOUD_PROJECT_ID} = require('../config/vars');


const gcDeleter=getDeleter({ GC_PRIVATE_KEY:GOOGLE_CLOUD_PRIVATE_KEY,
    GC_CLIENT_EMAIL:GOOGLE_CLOUD_CLIENT_EMAIL,
    GC_BUCKET_NAME:GOOGLE_CLOUD_BUCKET_NAME,GC_PROJECT_ID:GOOGLE_CLOUD_PROJECT_ID
});


exports.fetch = async (req,res)=>{

    if(req.params.value){

        const pickHandler= new PickHandler(req.params.value);
        pickHandler
        .add('id',fetchById)
        .last('name',fetchByName);
        
        if(req.query.with){
            try{
                const data= await pickHandler.exec(req.query.with);

                //check if anything found
                if(data.length<=0){
                   return res.status(404).json({message:"Not found"});
                }

                return res.json(data);
            }catch(err){
                res.status(500).json({'message':err.message});
            }
            return;
        }
        try{
            const data= await pickHandler.exec('id');
             //check if anything found
             if(data.length<=0){
                return res.status(404).json({message:"Not found"});
            }

            return res.json(data);
        }catch(err){
            return res.status(500).json({'message':err.message});
        }
    }else{
        try{
            const products=await fetchAll({start:req.query.start, perPage:req.query.perPage});
            res.json(products);
        }catch(err){
            res.status(500).json(err);
        }
    }
    
}

exports.create= async (req,res,next)=>{
    const data=JSON.parse(req.body);

    try{
        const productModel=new Product(data);
        try{
            await productModel.save();
            return res.status(201).json({message:'Product created.'});
        }catch(err){

            try{
                await gcDeleter(data.images);
            }catch(err){
                console.log(err);
            }
           return  res.status(500).json({message:err.message});
        }
    }catch(err){
        next(err);
    }


}

exports.update=  async (req,res)=>{
    const pickHandler= new PickHandler({req:req, param:req.params.value});
    pickHandler
    .add('id',updateById)
    .last('name',updateByName);

    console.log('data',req.body);

    if(req.query.with){
        try{
           const data=await pickHandler.exec(req.query.with);
           return res.json(data);
        }catch(err){
           return res.status(500).json(err)
        }
    }
    try{
        await pickHandler.exec('id');
        return res.status(204).json({message:"Updated successfully."});
     }catch(err){
        return res.status(500).json(err);
     }
}

exports.delete= async (req,res)=>{
    const pickHandler= new PickHandler({req:req, param:req.params.value});

    pickHandler
    .add('id',deleteById)
    .last('name',deleteByName);

    if(req.query.with){

        try{
            await pickHandler.exec(req.query.with);
            return res.status(200).json({message:"Deleted successfully"});
            // res.json({'Message':`Product with id ${req.params.value} deleted successfully.`});
        }catch(err){
            res.status(500).json(err);
        } 
        return;  
    }

    try{
        await pickHandler.exec('id');
        // res.json({'Message':`Product with id ${req.params.value} deleted successfully.`});
        return res.status(200).json({message:"Deleted Successfully."});

    }catch(err){
        res.status(500).json(err);
    }   
}

//#region  update 
    async function updateById(){
        const data=JSON.parse(this.parameters.req.body);

        
        if(data.images){
            try{
                const product=await Product.findOne({product_id:this.parameters.param});
                if(product)
                  await gcDeleter(product.images);
                else
                    throw {message:'No product found with given id.'}
               
            }catch(err){
                console.log(err);
                throw err;
            }
        };

        return Product.findOneAndUpdate({product_id:this.parameters.param},{$set:{...data}},{new:true,runValidators:true});
    }

    function updateByName(){
        return this.parameters;
    }
    
//#endregion


//#region  fetch

    function fetchById(){
        return   Product.find({product_id:this.parameters})
                        .sort({createdAt:-1,updatedAt:-1})
                        .select({createdAt:0,updatedAt:0,_id:0});
    }

    function fetchByName(){
        return   Product.find({name:new RegExp(this.parameters,'i')})
                        .sort({createdAt:-1,updatedAt:-1})
                        .select({createdAt:0,updatedAt:0,_id:0});
                        
    }


const fetchAll= async (options)=>{
    try{

        let perPage=parseInt( options.perPage || 0) || 10;
        let start=parseInt( options.start || 0) ;
        
        //if per page and start page is less than or equal to 0
        start=start <0 ? 0 : start;
        perPage= perPage <= 0 ? 10 : perPage;


       return Product.find()
                     .sort({createdAt:-1,updatedAt:-1})
                     .select({createdAt:0,updatedAt:0,_id:0})
                     .limit(perPage)
                     .skip(start);       
    }catch(err){
        console.log(err);
       throw err;
    }
}

//#endregion


//#region  delete

    async function deleteById(){
            try{
                const product=await Product.findOne({product_id:this.parameters.param});

                if(product){
                    if(product.images){
                        gcDeleter(product.images);
                    }
                }else{
                    throw {message:"Invalid product id."};
                }
           
           }catch(err){
                console.log(err);
                throw err;
            }
            return Product.deleteOne({product_id:this.parameters.param});
        }

    

    function deleteByName(){
        return this.parameters;
    }
//#endregion

