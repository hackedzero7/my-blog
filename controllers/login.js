
const {check,validationResult, Result}=require("express-validator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require('dotenv').config();
const users=require("../models/user");


//this is get request for login form,display form 
const login=(req,res)=>{
    const title="user login";
   res.render('assests/login',{title,login:false});
}


//this is the GET req for the registration form, display form
const register=(req,res)=>{
    const title="create new account";
    res.render('assests/register',{title,inputs:req.body,login:false});

}








//this is post req for registration form, when user fill the form and submit the form.


const registervalidation=[
   check('cno').isLength(),check('email').isEmail().withMessage("please enter valid email address"),check('uname').isLength({min:8}).withMessage("name must contain 8 characters"),check('psw').isLength({min:10}).withMessage("password must contain 10 characters")


]




const postregistration=async(req,res)=>{


    const title="registration";
    const errors=validationResult(req);
    const name=req.body.uname;
    const email=req.body.email;
    const password=req.body.psw;
    const phone=req.body.cno;
    
    if(!errors.isEmpty()){
    
    
       res.render("assests/register",{title,errors:errors.array(),login:false});
    
    
       
    
    }
    else{
    
    try{
    
    const emailcheck= await users.findOne({email:email})
    
    if(emailcheck==null){
    //send data to database if email does not exist
    
    const salt =await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);
    
    const data=new users({
    
    name:name,email:email,phone:phone,password:hashedpassword
    
    
    })
    const datasent=await data.save().then(user=>{console.log(user)}).catch(err=>{console.log(err.message)})

    
    res.render('assests/login',{title,inputs:req.body,login:false});
    
    
    
    
    }
    else{
       //if email exist then again render the resister wit error message
       res.render('assests/register',{title,errors:[{msg:"the email already exists in database"}],login:false})
       
       
       }
    
    
    
    
    }catch(err){
    
    console.log(err.message);
    
    }
    
       
    }
      //array() converts the object/json in to array
       // for each loop used to print array elements
       


}




//this is post req for login form, when user fill and submit the login form


const loginvalidations=[
   
   
   check('uname').not().isEmpty().withMessage("please enter the email"),check('psw').isLength({min:10}).withMessage("password must contain 10 characters")
]








const postloginform=async(req,res)=>{



    const errors=validationResult(req);

    const title="login"
    const name =req.body.uname.replace(/\s/g, ''); ;
    const password =req.body.psw;
    
    if(!errors.isEmpty()){
    
    
    res.render("assests/login",{errors:errors.array(),title,login:false});
    
    }
    else{
    
    console.log(name);
    console.log(password)
       const checkemail=await users.findOne({email:name})
       console.log("email"+checkemail)
       
       if(checkemail==null){
         
       console.log(checkemail);
       res.render("assests/login",{errors:[{msg:"sorry email does not exist"}],title,login:false})
       }
       
       else{
          const useremail=checkemail._id;
          const userpassword=checkemail.password;
          const verifypassword=await bcrypt.compare(password,userpassword);
          console.log(verifypassword);
          
           if(verifypassword==false){
    
             res.render("assests/login",{errors:[{msg:"password does not match"}],title,login:false})
    
    
           }
    
    else{
    //Create token for authorization
    const token=jwt.sign({USERID:useremail},process.env.JWT_KEY,{expiresIn:"7d"})
    // ceate session variable
    
    req.session.user=token;
    
    console.log(token);
    
    
    res.redirect("/profile");
    
    
    }
          
       }
       
    
    
    
    
    
    }
    





}






module.exports={

login:login,
register,postregistration,postloginform,registervalidation,loginvalidations
}