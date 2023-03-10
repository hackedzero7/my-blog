const mongoose=require('mongoose');
//now we defie schemas in mongo db
const defschema=mongoose.Schema;//here we create the schema 
const modelschema=new defschema({


    name:{
        type:String,
        
        
    },
    email:{
        type:String,
        
    },
    phone:{

        type:Number,
        
    },
    password:{

        type:String,
        
    }
    ,verify:{

        type:String,
        
    }
    
    
    

},{timestamps:true});
const users=mongoose.model("user",modelschema);//hew2re a collection create in mongodb by model.the function of mongoose
module.exports=users;