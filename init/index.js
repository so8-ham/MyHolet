const mongoose=require('mongoose');
const data=require('./data.js');
const Listing=require('../models/listing.js');

const mongo_URL="mongodb://127.0.0.1:27017/airbnb";
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(mongo_URL);
}

const initDB=async ()=>{
   await Listing.deleteMany({});
  data.data = data.data.map((obj)=>({...obj,owner:"695814b5a1db1f0ec29e3470"}));
   await Listing.insertMany(data.data);
   console.log("Data was initialized");
};
initDB();