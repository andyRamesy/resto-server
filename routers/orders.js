const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const express = require("express")
const router = express.Router();

//get all list of orders
router.get("/" , async(req,res) => {
    const orderList = await Order.find().populate("user" , "name"); //populate : apio n info momban user , oatra we name
    
    if(!orderList){
        res.status(500).json({success : false})
    }

    res.send(orderList);
})

//get an order by his id with his details
router.get("/:id" , async(req,res) => {
    const order = await Order.findById(req.params.id)
    .populate("user" , "name") //populate : apio n info momban user , oatra we name
    .populate({ //apina anle ny info anle product ny orderItems , d aveo apina n info anle category le product
        path : "orderItems" , populate : {
            path : "product" , populate : "category"
        }
    });
    if(!order){
        res.status(500).json({success : false})
    }

    res.send(order);
})


//get all the user's orders by the id of the user 
router.get("/get/userorders/:userid" , async(req,res) => {
    const userOrderList = await Order.find({user : req.params.userid}).populate({
        path : "orderItems" , populate : {
            path : "product" , populate : "category"
        }
    }).sort({"dateOrdered" : -1}); //populate : apio n info momban user , oatra we name
    
    if(!userOrderList){
        res.status(500).json({success : false})
    }

    res.send(userOrderList);
})

//manampy orderItem sy order miaraka am totalPrices
router.post("/", async (req,res)=>{
  
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity : orderItem.quantity,
            product : orderItem.product
        })
      
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    //atao ao anat variable le promise amle orderItemsIds = orderItemsIdsResolved
    const orderItemsIdsResolved = await orderItemsIds;


    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate("product" , "price")
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))
    const totalPrice = totalPrices.reduce((a,b) => a + b , 0)
    console.log(totalPrices)

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.send(order);
})

router.put("/:id", async(req,res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status : req.body.status
        
    },
    {
        new : true
    })

    if(order){
        res.status(200).json({
            success : true,
            message : "niova shipping!!!"
        })
    }
    else{
        res.status(500).json({
            success : false,
            message : "tsy nety"
        })
    }
})

//delete order with the orderItem 
router.delete("/:id" , (req,res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if(order){
            //ref ita le order d mapena le orderItems d manao await d findByIdAndRemove le orderItem
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({
                success : true,
                message : "the order voafafa"
            })
        }
        else {
            return res.status(404).json({
                success : false,
                message : "order tsy vofafa"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success : false , 
            error : err
        })
    })
})


//get the total sales of all the order sales
router.get("/get/totalsales" , async(req,res) => {
    const totalSales = await Order.aggregate([ //join all the field totalPrice from all documents and sum them to get the totalsales
        { $group : { _id : null, totalsales : { $sum : "$totalPrice"} }}
    ])
    
    if(!totalSales){
        return res.status(400).send("tsy mety generated le order")
    }
    res.send({totalsales : totalSales.pop().totalsales})
})

//get count of the all orders
router.get("/get/count", async (req,res) => {
    const orderCount = await Order.countDocuments((count) => count) //manisa n ao am Product 

    if(!orderCount){
        res.status(500).json({success : false})
    }
    
    res.send({
        orderCount : orderCount
    });
})


module.exports = router;