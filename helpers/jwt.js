const expressJwt = require("express-jwt");

function authJwt(){
    const secret = process.env.secret;

    return expressJwt({
        secret,
        algorithms : ["HS256"],
        isRevoked : isRevoked
    }).unless({ //ankoatran reto api reto d azo atao na tsy misy token ary
        path: [
             {url : /\/products(.*)/ , methods : ["GET" , "OPTIONS"]},
             {url : /\/categories(.*)/ , methods : ["GET" , "OPTIONS"]},
             "/users/login",
             "/users/register"
        ]
    })
}

async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true)
    }

    done();
}

module.exports = authJwt;