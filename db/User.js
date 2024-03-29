const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
name:String,
email:String,
password:String
});
//to export where users is the table name(model)
module.exports = mongoose.model("users",userSchema);