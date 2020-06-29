const express = require("express");
const expressLayouts= require("express-ejs-layouts");
const app= express();
const mongoose= require("mongoose");
const flash= require("connect-flash");
const session=require("express-session");
//const passport = require("./config/passport");
const passport= require("passport");
require("./config/passport")(passport);
app.use(expressLayouts);
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success_msg= req.flash("success_msg");
    res.locals.error_msg= req.flash("error_msg");
    res.locals.error= req.flash("error");
    next();
})
const db= require("./config/keys").url;
const port= process.env.PORT || 5000;
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>console.log("Connected"))
.catch(err=>console.log(err));

app.use("/", require("./router/index"));
app.use("/users", require("./router/users"));
app.listen(port, console.log(`Server started on ${port}`));
