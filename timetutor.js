var express = require('express');
var dotenv = require('dotenv')
dotenv.config();
// todo : 
dotenv.config({ path: `.${process.env.NODE_ENV}.env`});

var app = express();
const routes = require('./src/routers/timetutor.router'); 
app.use(routes);

var port = process.env.PORT
app.listen(port, ()=>{
    console.log("# start TimeTutor")
})