// Load environment variables first
if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const listingsRoutes=require('./classroom/routes/listings');
const reviews=require('./classroom/routes/review');
const session=require('express-session');
const { MongoStore } = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user");
const classroomUsers=require("./classroom/routes/user");



//CONNECTING OUR DATA DASE..
const dburl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});
//connect to Data Base...
async function main(){
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET || "mysupersecrectcode"
    },
    touchAfter: 24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});


const sessionOptions={
    store:store,
    secret:process.env.SECRET || "mysupersecrectcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Make flash messages and current user available in all templates
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


app.use('/listings',listingsRoutes);
app.use('/listings/:id/reviews',reviews);
app.use('/',classroomUsers);

//error handling middleweares..
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});


//generic error handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    const viewErr = (process.env.NODE_ENV === 'production') ? null : err;
    res.status(statusCode).render("listings/error.ejs",{message, err: viewErr});
});

app.listen(8080,()=>{
    console.log(`Server is listning to port 8080`);
});




// cluster password: eTF3Pnlq2RNpPyba
//cluster username:  sohammandal
//application code:  mongodb+srv://sohammandal:<db_password>@cluster0.xayk1da.mongodb.net/?appName=Cluster0