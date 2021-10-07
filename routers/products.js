const Product = require("../models/product");
const Category = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//get user by his id
router.get("/:id", async(req,res) => {
    //si l'id n'est pas valide 
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("tsy valid le id");
    }

    //mitady anle id d tonga d apfandraisina amle table category misy reference amn
    const product = await Product.findById(req.params.id).populate("category");

    if(!product){
        res.status(500).json({
            success : false,
            message : "tsy nety le izy"
        })
    }
    res.send(product);
})

//get all products && get all products from specifique category
router.get("/", async (req,res) => {
    //query param : localhost:3000/products?categories=2164654,6879231
    
    let filter = {}; //variable ho asinale id ho filtrena
    //ra misy category le product d splitena le category ra mapiditra maro2 izy
    if(req.query.categories){
        filter = {category : req.query.categories.split(",")} //ra ita le le id anle category d apdirina ao anatin le object filter 
    }

    //ref tafiditra ao am filter le iz d tadiavina ze tafiditra ao anat filter iny d tonga d apfandraisina amle table category mifandray amn
    const productList = await Product.find(filter).populate("category");

    if(!productList){
        res.status(500).json({success : false})
    }
    
    res.send(productList);
})


//get the count of all products
router.get("/get/count", async (req,res) => {
    const productCount = await Product.countDocuments((count) => count) //manisa n ao am Product 

    if(!productCount){
        res.status(500).json({success : false})
    }
    
    res.send({
        productCount : productCount
    });
})

//get the featured products
router.get("/get/featured/:count", async (req,res) => {
    //jerena ra misy ao
    const count = req.params.count ? req.params.count : 0

     //limitena n isan n avoka, count eto string fa mila asina anle + io d lasa number izy
     //satria limit() tsy maintsy number 
    const products = await Product.find({isFeatured:true}).limit(+count) //jerena ze misy isFeatured:true
    if(!products){
        res.status(500).json({success : false})
    }
    
    res.send(products);
})


//mapiditra product 
router.post(`/`, (req,res) => {
    //we need to use the schema
    const product = new Product({
        //we get the request from body
        name : req.body.name,
        description : req.body.description,
        countInStock : req.body.countInStock,
        category : req.body.category,
        isFeatured : req.body.isFeatured
    })
    //save() = save in the database
    product.save().then((createdProduct => {
        res.status(201).json(createdProduct)
    })).catch((err) => {
        res.status(500).json({
            error : err,
            success: false
        })
    })
})

router.put("/:id", async(req,res) =>{

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("tsy valid le id");
    }


    //mijery anle category ra misy
    const category = await Category.findById(req.body.category)
    
    if(!category) return res.status(400).send("tsy hita le category misy azy")
    
    
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured
    },
    {
        new : true,
        
    })
    if(product){
        res.status(200).json({
            success : true,
            message : "niova le product!!!"
        })
    }
    else{
        res.status(500).json({
            success : false,
            message : "tsy nety niova le product"
        })
    }
    

})


router.delete("/:id", async(req,res) => {
    await Product.findById({_id : req.params.id}, (err,product) => {
        if(product){
            product.delete().then(
                res.status(200).json({
                    success : true,
                    message : "voafafa le product!!!"
                })
            ); 
        }
        else{
            res.status(404).json({
                success : false,
                message : "tsy hita le saika ho fafana"
            })
        }
    })
})

module.exports = router;