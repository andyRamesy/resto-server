const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors')
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");

require("dotenv/config");
//const api = process.env.API_URL; tsy ilaina tsony

//http request authorization 
app.use(cors());
app.options("*", cors());

//Middleware = function dat has control of the req and the res of any API
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//routers variables 
const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");

//Routers
// app.use(`${api}/products`, productsRouter);
 app.use("/categories", categoriesRouter);
 app.use("/products", productsRouter);
 app.use("/users", usersRouter);
 app.use("/orders", ordersRouter)



//initialize the route
//backticks ar used to combine constant and strings  
//the find() function is returning a promise, we don't get right away the response from the db,
//so we have to wait for the request to be done, dats why we use async function and await syntax

//connection to mongoAtlas the atlas needs the string connection env variable
// mongoose.connect(process.env.CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "restoDB"
// })
mongoose.connect('mongodb://127.0.0.1:27017/restoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "restoApp"
})
    .then(() => {
        console.log("mety ny connection")
    })
    .catch((err) => {
        console.log("tsy mety ny connection am mongo" + err)
    })



//start the server
//the 2nd arg is a callback is there is no problem
app.listen(3000, () => {
   
    console.log("server running");
})