import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name :{type:String, required:true},
    category:{type:String,required:true},
    price:{type:Number,required:true},
    created_by:{type:String},
    deleted_at:{type:Boolean,default:false}
});

const product = mongoose.model("product",productSchema);

export default product;