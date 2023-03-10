const mongoose=require("mongoose")

//connection in mongodb
const mongoDB = "mongodb://127.0.0.1/my_database";


mongoose.connect(mongoDB,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{console.log("connected")}).catch((error)=>{console.log(error)})

//now we defie schemas in mongo db
const defschema=mongoose.Schema;//here we create the schema 
const modelschema=new defschema({


    name:{
        type:String,
        required:[true,"name required"],
        min:3
    },
    email:{
        type:String,
        required:true
    },
    phone:{

        type:String,
        required:true,min:5
    }
    

},{timestamps:true});
const somemodel1=mongoose.model("user",modelschema);//here a collection create in mongodb by model.the function of mongoose

// const name="sasa";
// const email="raki@gmail.com"
// phone="2123"

// const data= new somemodel1({
// name,email,phone



// })

// data.save().then((user)=>{console.log(user)}).catch((err)=>{console.log(err.message)})






//steps
//import mongoose
//connect mongodb
//define schema (varible)
//model define(collection)
//save dataa


//Recieve data 
somemodel1.find().then(data=>{
    console.log(data)
}).catch(err=>{
    console.log(err.message)
})
