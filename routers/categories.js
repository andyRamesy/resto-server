const Category = require("../models/category");
const express = require("express")
const router = express.Router();
//method samy hafa daol n nampiasaina amle miresaka am serveur


//get by id 
router.get("/:id", async(req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(404).json({
            success : false,
            message : "tsy hita le ID tadiavina"
        })
    }
    res.status(200).send(category)
    
})

//get list 
router.get("/" , async(req,res) => {
    const categoryList = await Category.find();

    if(!categoryList){
        res.status(500).json({success : false})
    }

    res.send(categoryList);
})


//save 
router.post("/", async(req,res) => {
    //we need to use the schema
    const category = new Category({
        //we get the request from body
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    })
    // category = await category.save();
    if(!category){
        return res.status(400).send("mila mapiditra category!");
        // res.status(400).send(category);
        
    }

    //save() = save in the database
    category.save().then((createdCategory => {
        if(category){
            res.status(201).json(createdCategory)
        }
        else {
            return res.status(400).send("mila mapiditra category!");
           // res.send(category);
        }
    })).catch((err) => {
        res.status(500).json({
            error : err,
            success: false,
            message : "nisy tsy nety"
        })
    })

  

  
})


//delete by id 
router.delete("/:id" , async(req, res) => {
    await Category.findById({_id : req.params.id} , (err,category) => {
            if(category){
            category.delete().then(
                res.status(200).json({
                    success : true,
                    data : category,
                    message : "voafafa!!!"
                })
            )
            console.log(category + "deleted")
            
        }
        else{
            res.status(404).json({
                success : false,
                message : "tsy hita le saika ho fafana"
            })
        }
      
    })
})

router.put("/:id", async(req,res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    },
    {
        new : true
    })

    if(category){
        res.status(200).json({
            success : true,
            message : "niova!!!"
        })
    }
    else{
        res.status(500).json({
            success : false,
            message : "tsy nety"
        })
    }
})
module.exports = router;