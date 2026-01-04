const Listing=require("../models/listing")
const mongoose = require('mongoose');


module.exports.index=async (req, res) => {
    try {
        const alllistings = await Listing.find({});
        res.render('listings/index', { allListings: alllistings });
    }
     catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

module.exports.renderNewForm=async (req, res) => {
   
    res.render("listings/new.ejs");
}


module.exports.showListings=async (req, res) => {
    // try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).send('Invalid listing id');
        const listing = await Listing.findById(id)
        .populate({path:'reviews',
            populate:{
                path:"author",
            }
        })
        .populate('owner');
        if (!listing) return res.status(404).send('Listing not found');
        if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listings");
        }
        res.render('listings/show', { listing });
}


module.exports.createListings=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
  const newlisting = new Listing(req.body.listing || {});
  newlisting.owner=req.user._id;
  newlisting.image={url,filename};
  await newlisting.save();
  req.flash("success","New Listings created!");
  res.redirect(`/listings`);
}

module.exports.editListings=async (req,res)=>{
    // try {
        let {id}=req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).send('Invalid listing id');
        let listing = await Listing.findById(id);
        if (!listing) return res.status(404).send('Listing not found');
        if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listings");
        }
let originalImg=listing.image.url;
 originalImg= originalImg.replace("/upload","/upload/w_250");

        res.render("listings/edit",{listing,originalImg});
}

module.exports.updateListings=async (req,res)=>{
        let {id}=req.params;
      let listing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
      if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
      }
          req.flash("success","Listings Updated!");
        res.redirect(`/listings/${id}`);
}

module.exports.deleteListings=async (req,res)=>{
        let {id}=req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).send('Invalid listing id');
        await Listing.findByIdAndDelete(id);
          req.flash("success","Listings Deleted");
        res.redirect("/listings");
}