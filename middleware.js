 const Listing=require("./models/listing");
 const Review=require("./models/review");
 const ExpressError=require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema');

 module.exports.isLoggedIn=(req,res,next)=>{
       if(!req.isAuthenticated()){
        //redirectUrl
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listings!");
      return  res.redirect("/login");
    }
    next();
 }


 module.exports.saveredirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
 };

 module.exports.isOwner= async (req,res,next)=>{
      let {id}=req.params;
       let listing = await Listing.findById(id);
       if(!listing.owner.equals(res.locals.currentUser._id)){
           req.flash("error","you dont have permission to edit");
          return res.redirect(`/listings/${id}`);
       }
       next();
 };

 module.exports. validateListing=(req,res,next)=>{
    // Coerce numeric inputs that come in as strings from forms
    if (req.body && req.body.listing) {
        if (typeof req.body.listing.price === 'string') {
            const raw = req.body.listing.price.trim();
            // Only convert if it's a non-empty numeric string
            if (raw !== '' && !Number.isNaN(Number(raw))) {
                req.body.listing.price = Number(raw);
            }
        }
        // Normalize image: convert string URL to object {url: ...} for consistency with model
        if (typeof req.body.listing.image === 'string') {
            const raw = req.body.listing.image.trim();
            if (raw === '') {
                // remove empty image so we don't overwrite existing image with empty string
                delete req.body.listing.image;
            } else {
                req.body.listing.image = { url: raw };
            }
        }
    }
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

module.exports. validateReview=(req,res,next)=>{
           let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}


module.exports.isReviewAuthor= async (req,res,next)=>{
      let {id,reviewId}=req.params;
       let reviewDoc = await Review.findById(reviewId);
       if(!reviewDoc || !reviewDoc.author.equals(res.locals.currentUser._id)){
           req.flash("error","You don't have permission to perform this action!");
          return res.redirect(`/listings/${id}`);
       }
       next();
 };