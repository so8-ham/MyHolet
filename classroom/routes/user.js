const express=require('express');
const router=express.Router();
const Wrapasync = require('../../utils/Wrapasync');
const passport=require('passport');
const { saveredirectUrl } = require('../../middleware');
const userController=require("../../controllers/user");

router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs");
})
.post(Wrapasync(userController.signupPost));

router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(
    saveredirectUrl,
    passport.authenticate("local",
        { failureRedirect: '/login',
            failureFlash:true }),
   userController.loginPost );
//loggedout..
router.get("/logout",userController.logout);

module.exports=router;
