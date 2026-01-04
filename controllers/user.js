const User=require("../models/user");


module.exports.signupPost=async (req,res,next)=>{
    try {
        let {username,email,password}=req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        // auto-login after registration
        req.login(registeredUser, (err)=>{
            if (err) return next(err);
            req.flash('success','Welcome to Airbnb!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.loginPost=async (req,res)=>{
        req.flash("success","welcome to Airbnb! You are logged in!");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
         return  next(err);
        }
        req.flash("success","You are logged Out Now!");
        res.redirect("/listings");
    });
}