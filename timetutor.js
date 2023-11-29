var express = require('express');
var dotenv = require('dotenv')
dotenv.config();
// todo : 
dotenv.config({ path: `.${process.env.NODE_ENV}.env`});

var app = express();
const routes = require('./src/routers/timetutor.router'); 
app.use(routes);

const loginRoutes = require('./src/routers/login.router'); 
app.use(loginRoutes);

const chatRoutes = require('./src/routers/chat.router'); 
app.use(express.json());
app.use('/chat', chatRoutes);

const qnaRoutes = require('./src/routers/qna.router'); 
app.use(express.json());
app.use('/qna', qnaRoutes);

app.use('/res', express.static(__dirname + "/res"))

var port = process.env.PORT
app.listen(port, ()=>{
    console.log("# start TimeTutor")
})