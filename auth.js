import User from "../models/user.js";
import secure from "bcrypt";
import jwt from "jsonwebtoken";
let secret = "12234567890"
import Product from "../models/product.js";
import { ObjectId } from "mongodb";



let refreshTokens = [];

export default {


  // signup user

  async signUser(req, res) {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const confirm_password = req.body.confirm_password;

      if (!name) {
        return res.status(422).json({ success: false, message: "Please Enter Name" });
      }

      if (!email) {
        return res.status(422).json({ success: false, message: "Please Enter Email" });
      }

      if (!password) {
        return res.status(422).json({ success: false, message: "Please Enter Password" });
      }

      if (password !== confirm_password) {
        return res.status(422).json({ success: false, message: "Please Check the Password" });
      }

      const existingUser = await User.findOne({ email: email })
      if (existingUser) {
        return res.status(422).json({ success: false, message: "User already existed, Please change your email" })
      }

      let hassPassword = await secure.hash(password, 10)
      let data = {
        name: name,
        email: email,
        password: hassPassword
      }
      await User.create(data)
      return res.status(201).json({
        success: true,
        message: "User registered successfully"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message
      });
    }
  },


  // // login 

  async loginUser(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      let user = await User.findOne({ email: email })
      if(!user){
        return res.status(422).json({success:false,message:"User not Found"})
      }
      let comparePassword = await secure.compare(password, user.password);
      if (!comparePassword) {
        return res.status(422).json({ success: false, message: "Password was wrong,please try again" })
      }
      let token = jwt.sign({ username: user.name, email: user.email }, secret,{expiresIn:"24hr"});

      const refreshToken = jwt.sign({username: user.name,email: user.email},secret,{expiresIn : "7d"});

      refreshTokens.push(refreshToken);
      return res.status(200).json({ success: true, message: "User logged in successfully",token,refreshToken});
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message
      });
    }
  },
  async createProduct(req, res) {
    try {
      const name = req.body.name;
      const category = req.body.category;
      const price = req.body.price;
      if (!name) {
        return res.status(422).json({ success: false, message: "Name is required" })
      };
      if (!category) {
        return res.status(422).json({ success: false, message: "category is required" })
      };
      if (!price) {
        return res.status(422).json({ success: false, message: "Price is required" })
      };
      let data = { name: name, category: category, price: price, created_by: req.email }
      let product = await Product.create(data);
      if (product) {
        return res.status(200).json({ success: true, message: "Product created Successfully" })
      }
    } catch (error) {
      return res.status(422).json({ success: false, message: "Something want wrong" })
    }
  },

  // Get the products

  async getAllProduct(req, res) {
    try {
      let products = await Product.find({deleted_at:{$ne:true}});
      if (products) {
        return res.status(200).json({ success: true, message: "All received the data", data: products })
      }
    } catch (error) {
      return res.status(422).json({ success: false, message: "We not get the data" })
    }
  },
  // get by Id

  async getproductbyId(req, res) {
    try {
      const id = req.params.id
      let product = await Product.findOne({ _id: new ObjectId(id) })
      // let product = await Product.findById(id);
      if (product) {
        return res.status(200).json({ success: true, message: "we get the data by ID", data: product })
      }
    } catch (error) {
      return res.status(422).json({ success: false, message: "The Id does not exist" })
    }
  },
  // update the product 


  async UpdateProductbyId(req, res) {
    const id = req.params.id;
    let updateProduct = req.body;
    try {
      let findProduct = await Product.findOne({ _id: new ObjectId(id) });
      if (findProduct) {
        let update = await Product.updateOne({ _id: new ObjectId(id) }, { $set: updateProduct })
        if (update) {
          return res.status(200).json({ success: true, message: "succesfully Updated" });
        }
      }
    } catch (error) {
      return res.status(422).json({ success: false, message: "product not updated" })
    }
  },

  // Delete api

  async deleteProductId(req, res) {
    const id = req.params.id;
    try {
      let findProduct = await Product.findOne({ _id: new ObjectId(id) });

      if (findProduct) {
        let deleteproduct = await Product.deleteOne({ _id: new ObjectId(id) });

        if (deleteproduct) {
          return res.status(200).json({ success: true, message: "Product deleted Successfully!" })
        }
      }
    } catch (error) {
      return res.status(422).json({ success: false, message: "Product not exist" })
    }
  },

// Delete and Update api

 async  deleteandUpdateProductId(req,res){
  const id = req.params.id;
  try{
    let findProduct = await Product.findOne({_id:new ObjectId(id)});
  if(findProduct){
    let Update = await Product.updateOne({_id : new ObjectId(id)},{$set:{deleted_at:true}});
    if(Update){
      return res.status(200).json({success:true,message:"successfully updated",})
    }
  }
  }catch(error){
    return res.status(422).json({success:false,message:"Update not done!"})
  }
 }
}










