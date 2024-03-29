const mongoose = require('mongoose');
const hadithSchema=new mongoose.Schema({

    title:String,
    hadith:String,
    translation:String,
    narrators:String,
    source:String,
    category:String
    
});
module.exports=mongoose.model("hadiths",hadithSchema);

