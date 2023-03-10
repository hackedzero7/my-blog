// this is GET req for user profile , when user successfully submit the login form, so jwt token also create and we stores in to
//the session variables and next time user does not need to login again , it will automatically redirect to this (profile route) until and unless user logout 
// if user logout the all session variable will be destroyed then user ill have to login again to acces his profile

const userprofile=async(req,res)=>{

    const id=req.id;    
    const currentuser=await users.findById({id});
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
     //profile photo 20%
    //description/about 20%
    //social media icons link 20%
    //post >=1 20% (if post 0 than -20%)
    //cover photo 20%
    var profilecomlete=20;
    const photo=await profilephoto.findOne({userID:id})
    const moredetails=await moredetail.findOne({_id:id})
    const sociallink=await sociallinks.findOne({_id:id})
    const noofposts=await posts.find({userID:id}).countDocuments();
    if(photo!==null){
    
    profilecomlete=profilecomlete+20;
    
    }
    
    if(moredetails!==null){
    
       profilecomlete=profilecomlete+20;
       
       }
       
       if(sociallink!==null){
    
          profilecomlete=profilecomlete+20;
          
          }
          
          if(noofposts>0){
    
             profilecomlete=profilecomlete+20;
             
             }
             
    
    
    res.render("assests/profile",{login:true,id:id,name,email,phone,currentposts,allposts,count:countDocuments,current:curretpage,perpage:perpage,existphoto,pro:profilecomlete});
    console.log(name);
    
    
    
}
    module.exports={
    
      userprofile
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    