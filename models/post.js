
const mongoose=require('mongoose');
//now we defie schemas in mongo db
const postschema=mongoose.Schema;//here we create the schema 
const postmodelschema=new postschema({


    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
        
        
    },
    title:{
        type:String,
        required:true
    },
    post:{

        type:String,
        required:true
    },
    image:{

        type:String,
        required:true
    },
    uname:{

        type:String,
        required:true
    },views:{

type:Number,


    }
    
    
    
    

},{timestamps:true});
const posts=mongoose.model("post",postmodelschema);//hew2re a collection create in mongodb by model.the function of mongoose
module.exports=posts;