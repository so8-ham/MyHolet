const express=require('express');
const router=express.Router({mergeParams:true});
const WrapAsync=require('../../utils/Wrapasync');
const {validateReview, isLoggedIn, isReviewAuthor } = require("../../middleware.js");
const reviewController=require("../../controllers/reviews.js");
//Reviews Route
router.post("/",
  isLoggedIn,
    validateReview,
     WrapAsync(reviewController.reviewPost));

//delete reviews route can be added simultaniously..
 router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(reviewController.destroy));
 module.exports=router;