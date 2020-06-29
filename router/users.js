const express=require("express");
const router= express.Router();
const User= require("../modals/User"); 
const bcrypt= require("bcryptjs");
const passport= require("passport");
router.get('/login', (req, res)=>{
    res.render("login")
})
router.get('/register', (req, res)=>{
    res.render("register")
})
router.post("/register", (req, res)=>{
   const { name, email, password, password2 }= req.body;
   let errors=[];
   if(!name || !email || !password || !password2)
   {
       errors.push({msg:"please fill in all details"});

   }
   if(password!== password2)
   {
       errors.push({msg: 'Passwords dont match'});
   }
   if(password.length<6)
   {
       errors.push({msg: "password must be atleast 6 characters"});
   }
   if(errors.length>0)
   {
    res.render("register", {errors, name, email, password, password2});
   }
   else
   {
      User.findOne({ email:email})
      .then(user =>{
          if(user){
              errors.push({msg:"User already exisits"})
            res.render("register", {errors, name, email, password, password2});
          }
          else{
            const newUser= new User({
                name, email, password
            });
            bcrypt.genSalt(10, (err, salt)=>{
                if(err)
                throw err;
                bcrypt.hash(newUser.password, salt, (err, hash)=> {
                  if(err)
                  throw err;
                  newUser.password= hash;
                  newUser.save()
                  .then(user =>{
                      req.flash("success_msg", "You are now registered and can noe login");
                      res.redirect("/users/login");
                  })
                  .catch(err=> console.log(err));  
                })
            })
            console.log(newUser);
           
          }
      })
   }

})

router.post("/login", (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect: '/login', 
        failureFlash:true
    })(req, res, next);
});

router.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success_msg", "You have been logged out");
    res.redirect("/users/login");
})
module.exports= router;