const express=require("express");
const {check,validationResult, Result}=require("express-validator");

const db=require("../models/db");
const { urlencoded } = require("express");
const users=require("../models/user");
const posts=require("../models/post");
const path = require('path');




const customersupport=require("../models/customersupport");
const jwt=require("jsonwebtoken")
require('dotenv').config();
const {auth}=require("../middlewares/auth")
const {stoplogin}=require("../middlewares/auth")
const formidable = require('formidable');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const fs=require('fs');

const e = require("express");
const profilephoto = require("../models/profilephoto");

const moredetail=require("../models/moredetail")
const { findOne, countDocuments } = require("../models/user");
const { Script } = require("vm");
const { dirname } = require("path");


const {login,register,postregistration,postloginform,registervalidation,loginvalidations}=require("../controllers/login")
const {userprofile}=require("../controllers/profilecontrollers");
const { findByIdAndUpdate } = require("../models/post");


//router is builten middleware in express js 
const router=express.Router();


router.get("/",stoplogin,(req,res)=>{
   res.send("server is working fine now")
// res.render("assests/login",{title:"login",login:"false"})

})
router.get("/login",stoplogin,login)
router.get("/register",stoplogin,register)
router.post("/registration",registervalidation,postregistration)
router.post("/postlogin",loginvalidations,postloginform);







router.get("/profile/:page",auth,async(req,res)=>{

   console.log("token "+req.session.user);


   





const id=req.id;

const currentuser=await users.findById(id);
const name=currentuser.name;
const email=currentuser.email;
const phone=currentuser.phone;


const currentposts=await posts.find().sort({updatedAt:-1});
console.log(currentposts);





//code for pagination


let curretpage=1;
const page=req.params.page;

curretpage=page;
   

const perpage=4;
const skippages=(curretpage - 1) * perpage;


 const allposts=await posts.find().skip(skippages).limit(perpage).sort({updatedAt:-1})
 
 const countDocuments=await posts.find().countDocuments();





 
 const existphoto=await profilephoto.findOne({userID:id})
 console.log(existphoto);

 //profile completeness calculations and logic
//  (1)   20% after sucessful account creation
 // (1)profile photo 20%
// (1)description/about 30%
// (4)post >=1 add 30% (if post 0 than -20%)

var profilecomlete=20;
const photo=await profilephoto.findOne({userID:id})
const moredetails=await moredetail.findOne({userID:id})
const noofposts=await posts.find({userID:id}).countDocuments();
console.log("Posts"+noofposts)

if(photo!==null){

profilecomlete=profilecomlete+20;

}


if(noofposts>=1){

   profilecomlete=profilecomlete+30;
   
   }


if(moredetails!==null){

   profilecomlete=profilecomlete+30;
   
   }
      


res.render("assests/profile",{login:true,id:id,name,email,phone,currentposts,allposts,count:countDocuments,current:curretpage,perpage:perpage,existphoto,pro:profilecomlete,currentuser});
console.log(name);

})


router.get('/profile',(req,res)=>{

res.redirect('/profile/1')


})





router.get("/logout",(req,res)=>{
   req.session.destroy();
   res.redirect("/login")
      

})

router.get("/createpost",auth,(req,res)=>{

res.render("assests/postform",{login:true})
})






router.post("/submitedform",auth,(req,res)=>{

   const form = formidable();
   form.parse(req, async(err, fields, files) => {

 console.log(fields);      
      const {title,postblog}=fields;
      
      
      
      const errors=[];
    
if(title.length===0){

   errors.push({msg:'title length is very less'})
      
   
   }
    
   if(postblog.length<50){

      errors.push({msg:'title length should minimum 50 characters'})   
      
   }


   if(files.image.originalFilename.length===0){

      errors.push({msg:'image not uploaded so try again'})   
      }


      const imagename=files.image.originalFilename;
   const split=imagename.split(".");
   const imageext=split[split.length-1].toUpperCase();








if(imageext!='JPG' && imageext!='PNG'){
errors.push({msg:'kindly upload jpg or png files. '+imageext+' is not supported'})

}



   if(errors.length!==0){
      console.log(errors);
      console.log(imageext);

      res.render("assests/postform",{errors,login:true})

   }else{

files.image.originalFilename=uuidv4()+'.'+imageext;
      const oldpath=files.image.filepath;
      const newpath="E:/blog website/views/uploads/"+files.image.originalFilename;
      
      
      fs.readFile(oldpath,(err,data)=>{
      
      if(!err){
      
            fs.writeFile(newpath,data,(err)=>{
      
      if(!err){
          fs.unlink(oldpath,(err)=>{
      if(!err){
         res.redirect('/myposts/1')
      }
          })
      }
         })}
      
      })
      








      const ids=req.id;
      console.log(ids);
      const usname=await users.findOne({_id:ids});
      const username=usname.name
   
   
   
   
   const saveposts=new posts({
   
      userID:ids,
         title:title,
         image:files.image.originalFilename,
         post:postblog,
         uname:username
      
      
      
      })
      
   const post=await saveposts.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})
   
   






   }







   
   })


})




router.get('/myposts/:page',auth,async(req,res)=>{


let curretpage=1;
const page=req.params.page;

curretpage=page;
   

const perpage=4;
const skippages=(curretpage - 1) * perpage;


const id=req.id;


 const allposts=await posts.find({userID:id}).skip(skippages).limit(perpage).sort({updatedAt:-1})
 
 const countDocuments=await posts.find({userID:id}).countDocuments();



res.render('assests/showposts',{login:true,post:allposts,count:countDocuments,current:curretpage,perpage:perpage});


})


router.get('/myposts',auth,async(req,res)=>{
res.redirect('/myposts/1')
});








router.get("/postdetail/:id",auth,async(req,res)=>{
const postid=req.params.id;
const loggeduser=req.id

const postdata=await posts.findOne({_id:postid})
console.log(postdata);


res.render('assests/postdetail',{postdata:postdata,loggeduser,postid,login:true})



})



router.get('/update/:id',auth,async(req,res)=>{

const id =req.params.id;
const datatoupdate=await posts.findOne({_id:id})

console.log(datatoupdate)



res.render('assests/update',{datatoupdate:datatoupdate,login:true})



})


router.post('/submitforupdate',[check('title').not().isEmpty().withMessage("please enter the title"),check('postblog').isLength({min:10}).withMessage("enter post ")],auth,async(req,res)=>{

  const errors=validationResult(req);
  const title=req.body.title;
  
  console.log(title);
  console.log(errors);

  
  if(!errors.isEmpty()){
   const uid=req.body.hiddenid;
   console.log(uid)

const datatoupdate=await posts.findOne({_id:uid})
res.render('assests/update',{login:true,errors:errors.array(),datatoupdate})



  }else{
   const title=req.body.title;
   const hiddenid=req.body.hiddenid;
   const blogpost=req.body.postblog;
try{

   const updatingdata=await posts.findByIdAndUpdate(hiddenid,{title:title,post:blogpost})


}catch(err){

res.send(err.msg)
//msg is function of err

}



   res.redirect('myposts/1')


  }
   
   })
   

router.get("/deletepost/:id",auth,async(req,res)=>{
   
   try{
      const id=req.params.id;
const deletingdata=await posts.findByIdAndRemove(id);


res.redirect("/myposts/1")


}catch(err){




   res.send(err.msg)
}




})




   router.get("/uploadprofile",auth,async(req,res)=>{

const id=req.id;
const existphoto=await profilephoto.findOne({userID:id})

console.log(existphoto)




      res.render("assests/photouploader",{login:true,existphoto})   
      })
   




      router.post("/postprofile",auth,(req,res)=>{

         const forms = formidable();
         forms.parse(req, async(err, fields, files) => {
      
if(files.length!==0){
   console.log(files);    
   

const imagename=files.profileimage.originalFilename;
const split=imagename.split(".");
const imageext=split[split.length-1].toUpperCase();

files.profileimage.originalFilename=uuidv4()+'.'+imageext;
const oldpath=files.profileimage.filepath;


 console.log( path.join(__dirname, '../views/profiles'))


const newpath=path.join(__dirname, '../views/profiles/')+files.profileimage.originalFilename;




fs.readFile(oldpath,(err,data)=>{

if(!err){

      fs.writeFile(newpath,data,(err)=>{

if(!err){
    fs.unlink(oldpath,(err)=>{

    })
}
   })}

})






const id=req.id;
const data=await users.findOne({_id:id})


const name=data.name

const userid=data._id;



const photo=new profilephoto({

userID: userid,
name:name,
userimage:files.profileimage.originalFilename


});

const savedimage=await photo.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})





res.redirect('/uploadprofile')




   





}
else{

   res.send("Not uploaded and try again")


}
   
                     })
         })








         router.post("/updateprofilephoto",auth,(req,res)=>{

console.log("req came")

            const forms = formidable();
            forms.parse(req, async(err, fields, files) => {
         
   if(files.length!==0){
      console.log(files);    
      
   
   const imagename=files.profileimage.originalFilename;
   const split=imagename.split(".");
   const imageext=split[split.length-1].toUpperCase();
   
   files.profileimage.originalFilename=uuidv4()+'.'+imageext;
   const oldpath=files.profileimage.filepath;

   
 console.log( path.join(__dirname, '../views/profiles'))

   const newpath=path.join(__dirname, '../views/profiles/')+files.profileimage.originalFilename;
   
   
   
   
   fs.readFile(oldpath,(err,data)=>{
   
   if(!err){
   
         fs.writeFile(newpath,data,(err)=>{
   
   if(!err){
       fs.unlink(oldpath,(err)=>{
   
       })
   }
      })}
   
   })
   
   
   
   const id=req.id;
   
   const filter = { userID: id };
   const updateimage = { userimage: files.profileimage.originalFilename };
   const updatephoto=await profilephoto.findOneAndUpdate(filter,updateimage)
   
   
   
   

   
   
   
   res.redirect('/uploadprofile')
   
   
   
   
      
   
   
   
   
   
   }
      





         
           
            })
         





         })


          









         router.get("/customersupport",auth,(req,res)=>{
            res.render("assests/customersupport",{login:true,title:'customer support'})   
           })
        

           router.post("/supportmessage",auth,async(req,res)=>{






            const id=req.id;
            const data=await users.findOne({_id:id})
            const message=req.body.message;
            const reason =req.body.reason;
            
            const name=data.name;
            const email=data.email;
         
         
            
      


            console.log(process.env.EMAIL)

            //step 1
            let transporter = nodemailer.createTransport({
               service:'gmail',
               auth: {
                 user:'', // generated ethereal user
                 pass: 'gyegiwtbyxsuwqai' // generated ethereal password
               },
             });



        //step2
        let mailoptions={


         from: '', // sender address
         to: email, // list of receivers
         subject:"hey!"+name +"✔ we are working on your request", // Subject line
         //text: "thanks for contacting bloging.pk ", // plain text body
         html: `"<h2>thanks ${name} for contacting bloging.pk. we are working on your req and respond you as soon as possible .</h2>"`, // html body

        }




transporter.sendMail(mailoptions,(err,info)=>{


   if(err){
      console.log(err)
   }
   else{

      console.log("message sent!!!")
   }
})







const savecs=new customersupport({
   
   userID:id,
      name:name,
      message:message,
      reason:reason
     
   
   
   })
   
const cs=await savecs.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})













     


            res.redirect('/profile')
           })





           router.get("/settings",auth,(req,res)=>{
            res.redirect('/uploadprofile')   
           })


















router.get("/userprofilepage/:id",auth,async(req,res)=>{



   const id=req.params.id;
console.log(id);


   const userdata=await users.findOne({_id:id});
   
   const totalposts=await posts.find({userID:id}).limit(2);
console.log(totalposts);
 

const countposts=await posts.find({userID:id}).countDocuments();
console.log(countposts);



   const userprofile=await profilephoto.findOne({userID:id});

   console.log(userprofile);


   const addmoredata=await moredetail.findOne({userID:id})

   console.log(path.join(__dirname, '../views/assests/images'));

const loggeduser=req.id;

res.render("assests/userprofilepage",{login:true,userdata,userprofile,countposts,totalposts,addmoredata,loggeduser,id})


})





router.get("/userprofilepage",auth,async(req,res)=>{


   const id=req.id;
res.redirect(`/userprofilepage/${id}`)   
  })

   

router.get("/verifyaccount",auth,async(req,res)=>{
const id=req.id;
const userdata=await users.findOne({_id:id})









          //step 1
            let transporter = nodemailer.createTransport({
               service:'gmail',
               auth: {
                 user:'', // generated ethereal user
                 pass: 'gyegiwtbyxsuwqai' // generated ethereal password
               },
             });



        //step2
        let mailoptions={


         from: '', // sender address
         to:userdata.email, // list of receivers
         subject:"hey!"+userdata.name+"verify your account ✔ ", // Subject line
         //text: "thanks for contacting bloging.pk ", // plain text body
         html: `<h2>hey! ${userdata.name} welcome bloging.pk<br>
          please click the link below to verify your account here</h2><br>
          <a href="http://localhost:5000/verifyaccount/${userdata._id}" style="text-decoration: none;"><button class="btn btn-danger" class="desc-stat">verifey </button></a>
          `, // html body

        }




transporter.sendMail(mailoptions,(err,info)=>{


   if(err){
      console.log(err)
   }
   else{

      console.log("message sent!!!")
      
   }


res.redirect('/userprofilepage')

})











  })








  router.get("/verifyaccount/:id",auth,async(req,res)=>{

   const id=req.params.id

   try{
   const userdata=await users.findOne({_id:id})
   if(userdata!==null){


const verify=await users.findByIdAndUpdate(id,{verify:"verified"});
console.log(verify)









      res.render("assests/verifymessage",{userdata})
      }
   
   }
   catch(err){

      res.send("we could not verify your account");
   }
   

  })


//display add more detail form
  
  router.get("/addinfo",auth,async(req,res)=>{

const id =req.id
   const addmoredata=await moredetail.findOne({userID:id})

   

   res.render("assests/aboutuser",{login:true,addmoredata});   
  })




//recieve the data of user here
  
  router.post("/userinfo",auth,async(req,res)=>{
   const occupation=req.body.accupation

   const message=req.body.message;
   console.log(occupation+message)


   const userid=req.id;
   

const userdetail=new moredetail({

   userID: userid,
   occupation:occupation,
   about:message
   
   
   });
   
   const savedetails=await userdetail.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})

   res.redirect("/addinfo")
  })










//update the userinfo here 


  router.post("/updateuserinfo",auth,async(req,res)=>{

 const accupation=req.body.accupation;
 const message=req.body.message;
 const id=req.id;


 try{

   const data=await moredetail.findOneAndUpdate({userID:id,about:message,occupation:accupation})
 }catch(err){

res.send("data could not updated please try again")
 }





   res.redirect("/addinfo")   
  })






  router.get("/changeusername",auth,async(req,res)=>{
   const id =req.id;
   const user =await users.findOne({_id:id})
    console.log(user.name);
   res.render("assests/changeusername",{login:true,user})   
  })


router.post('/updateusername',auth,async(req,res)=>{
const username=req.body.term;




const id =req.id;
console.log(id)
console.log(username)

try{

   const data=await users.findByIdAndUpdate(id,{name:username})
const data2=await posts.updateMany({userID:id},{$set:{uname:username}})


 }catch(err){

res.send(err)
 }






   
})





router.get("/findposts",(req,res)=>{

res.render("assests/searchpage",{login:true})



})

router.get("/search",auth,async(req,res)=>{
   const data=req.query.post
console.log(data);


//here is the code to use regex and find data related to search 
const relatedposts=await posts.find({



   "$or":[
   
   
      {"post":{$regex:data}},
      {"title":{$regex:data}}
      
      ]
      
      
      
   



   }).limit(5);
   



res.render("assests/searchpage",{login:true,relatedposts,data})




   

})





router.get('/users',async(req,res)=>{

   //write code to find user
const lin=req.body.term;


console.log("here is"+lin)

   res.render("assests/searchuser",{login:true})
   
      })
      
   



      router.post('/searchusersnames',auth,async(req,res)=>{

         //write code to find user
      const data=req.body.name;
      
const totalusers=await users.find(

{


   "$or":[
   
   
      {"name":{$regex:data}},
      {"email":{$regex:data}}
      
      ]



}

);
      

      
      
   res.send(totalusers)
         
            })
            
      







            router.get('/user',auth,async(req,res)=>{
const id=req.query.id;
               




const userdata=await users.findOne({_id:id});
   
   const totalposts=await posts.find({userID:id}).limit(2);
console.log(totalposts);
 

const countposts=await posts.find({userID:id}).countDocuments();
console.log(countposts);



   const userprofile=await profilephoto.findOne({userID:id});

   console.log(userprofile);


   const addmoredata=await moredetail.findOne({userID:id})

   console.log(path.join(__dirname, '../views/assests/images'));

const loggeduser=req.id;

res.render("assests/searchuserspage",{login:true,userdata,userprofile,countposts,totalposts,addmoredata,loggeduser,id})














                  })
                  
               






  router.post('/searchrelatedposts',async(req,res)=>{


//write code to combine the collection

const searchreq=req.body.name;



const relatedpost=await posts.find({



   "$or":[
   
   
      {"title":{$regex:searchreq}},
      {"post":{$regex:searchreq}}
      
      ]




})


res.send(relatedpost)


   })
   


router.post("/viewscounter",async(req,res)=>{

const data =req.body.term
console.log(data);

const postdata=await posts.findById(data);
console.log(postdata)
 
const a=postdata.views;
console.log(a)
 if(typeof a!=="undefined"){
const calculateviews=a+1;

const updateview=await posts.findByIdAndUpdate(data,{views:calculateviews})

 }
 else{

const view=1;
const updateview=await posts.findByIdAndUpdate(data,{views:view})

 }




})

router.use((req,res,next)=>{

res.send("this page does not exist");

})
module.exports=router;





      
   







