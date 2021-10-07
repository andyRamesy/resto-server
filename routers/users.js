const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { token } = require("morgan");
const jwt = require("jsonwebtoken");

//get all list of users
router.get(`/`, async (req, res) => {
    const userList = await User.find().select("name email city");

    if(!userList){
        res.status(500).json({success : false});
    }
    res.send(userList);
})

//get user by id and exclude the password
router.get("/:id", async (req, res) => {
    const user = await User.find().select("-passwordHash");

    if(!user){
        res.status(500).json({success : false});
    }
    res.send(user);
})

router.post("/", async (req,res) => {
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        passwordHash : bcrypt.hashSync(req.body.password,10),
        phone : req.body.phone,
        isAdmin : req.body.isAdmin,
        street : req.body.street,
        apartment : req.body.apartment,
        city : req.body.city,
        zip : req.body.zip ,
        country : req.body.country
    })
    user.save().then((createdUser => {
        res.status(201).json(createdUser)
    })).catch((err) => {
        res.status(500).json({
            error : err,
            success : false
        })
    })
})

router.post("/register", async (req,res) => {
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        passwordHash : bcrypt.hashSync(req.body.password,10),
        phone : req.body.phone,
        isAdmin : req.body.isAdmin,
        street : req.body.street,
        apartment : req.body.apartment,
        city : req.body.city,
        zip : req.body.zip ,
        country : req.body.country
    })
    user.save().then((createdUser => {
        res.status(201).json(createdUser)
    })).catch((err) => {
        res.status(500).json({
            error : err,
            success : false
        })
    })
})

//login = manao recherche anle email, ra ita izy d aptovina amle password n passwordHash 
//mila m'import jwt 
router.post("/login", async(req,res) => {
    const secret = process.env.secret;
    const user = await User.findOne({email : req.body.email}) //tadiavina am alalan email 

    if(!user) {      
        return res.status(400).send("tsy hita le user");
    }

    //mlogin = ra mitovy le password napdirin client s n passwordHash stocké ao bdd d connecté izy
    //else tsy maazo token izy
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign({
            userId : user.id,
            isAdmin : user.isAdmin,
        },
        secret, //mot secret apesaina amle manao comparaison
        {expiresIn : "1d"} //delai d'expiration
        )
        //
        res.status(200).send({user : user.email , token : token})
    }
    else{
        res.status(500).send("diso le info napdirina")
    }

      // return res.status(200).send(user);
    
})


router.get("/get/count", async (req,res) => {
    const userCount = await User.countDocuments((count) => count) //manisa n ao am Product 

    if(!userCount){
        res.status(500).json({success : false})
    }
    
    res.send({
        userCount : userCount
    });
})


router.delete("/:id", async(req,res) => {
    await User.findById({_id : req.params.id}, (err,user) => {
        if(user){
            user.delete().then(
                res.status(200).json({
                    success : true,
                    message : "voafafa le user!!!"
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