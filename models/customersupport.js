
const mongoose=require('mongoose');
//now we defie schemas in mongo db
const postschema=mongoose.Schema;//here we create the schema 
const postmodelschema=new postschema({


    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
        
        
    },
    name:{
        type:String,
        required:true
    },
    message:{

        type:String,
        required:true
    }
    
    
    
    

},{timestamps:true});
const customersupport=mongoose.model("customersupport",postmodelschema);//hew2re a collection create in mongodb by model.the function of mongoose
module.exports=customersupport;