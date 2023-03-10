

const ejs= require("ejs");
const express=require("express");
const userrouter=require("./routes/userroute");
const con=require("./models/db");
const users=require("./models/user");
const posts=require("./models/post");
const session=require("express-session");
var MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const Swal = require('sweetalert2');





require('dotenv').config();
const app=express();




//database connection
con();


//connect-mongodb-session

var store = new MongoDBStore({
    uri: process.env.DB,
    collection: 'mySessions'
  });


//express session


app.use(session({
  secret: 'keyboardcat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge:1000 * 60 * 60 *24 * 7
  
  },
  store:store

}))




app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}))

app.use(express.static("./views"));
const PORT=process.env.PORT || 5000;








//routers

app.use(userrouter);



app.listen(PORT,()=>{

    console.log("server is running at port 5000")
})