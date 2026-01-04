const express=require('express');
const router=express.Router();
const WrapAsync=require('../../utils/Wrapasync');
const { isLoggedIn, isOwner, validateListing } = require("../../middleware.js");
const listingController=require("../../controllers/listings.js");
const multer  = require('multer');
const {storage}=require('../../cloudeConfig.js');
const upload = multer({storage});


router.route("/")
.get(WrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing,
     upload.single('listing[image]'),
     WrapAsync(listingController.createListings));
//new Route
router.get("/new",isLoggedIn,WrapAsync(listingController.renderNewForm));

router.route("/:id")
.get(WrapAsync(listingController.showListings))
.put(
     isLoggedIn,
     isOwner,
      upload.single('listing[image]'),
    validateListing,
    WrapAsync(listingController.updateListings))
.delete(
    isLoggedIn,
    isOwner,
    WrapAsync(listingController.deleteListings));

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    WrapAsync(listingController.editListings));
module.exports=router;