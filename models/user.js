const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

// Normalise plugin export (some bundlers export as { default: fn })
const plmPlugin = (typeof passportLocalMongoose === 'function') ? passportLocalMongoose : (passportLocalMongoose && passportLocalMongoose.default) ? passportLocalMongoose.default : null;
if (!plmPlugin || typeof plmPlugin !== 'function') {
    throw new Error('Could not load passport-local-mongoose plugin; expected a function');
}

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(plmPlugin);

module.exports=mongoose.model("User",userSchema);