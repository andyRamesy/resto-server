const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    icon : {
        type : String
    },
    color : {
        type : String , 
    }
})

//after creating the schema , we need to create the model and export it 
module.exports = mongoose.model("Category", categorySchema)
