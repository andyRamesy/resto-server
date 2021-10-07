const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
   name : {
       type : String,
       required: true
   },
   description : {
       type : String,
       required : false
   },
   richDescription : {
       type : String ,
       default : ""
   },
   image : {
       type : String, 
       default : ""
   },
   images : [{
       type : String
   }],
   brand : {
       type : String,
       default : ""
   },
   price : {
       type : Number,
       default : 0
   },
   category : {
       type : mongoose.Schema.Types.ObjectId,
       ref : "Category",
       required : true
   },
   countInStock : {
       type : Number,
       required : false,
       min : 0,
       max : 255
   },
   rating : {
       type : Number,
       default : 0
   },
   numReviews :  {
       type : Number , 
       default : 0 
   },
   isFeatured : {
       type : Boolean,
       default : false
   },
   dateCreated : {
       type : Date,
       default : Date.now
   }
})

//these 2 methods is to get id key without the underscore, this is more friendly frontend
productSchema.virtual("id").get(function() {
    return this._id.toHexString();
});

productSchema.set("toJSON" ,{
    virtuals : true,
})


//after creating the schema , we need to create the model and export it 
module.exports = mongoose.model("Product", productSchema)
