require('dotenv').config();
const express = require('express');
const path  = require('path');
const mongoose = require('mongoose');



const MongoUri = process.env.ATLAS_URI

const setMiddleware = require('./middleware/middlewares');
const setRoute = require('./routes/routes');

const app = express();


//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




//using middleware form middleware directory
setMiddleware(app);
//using routes form route directory
setRoute(app);


//error handle
app.use((req,res,next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})
app.use((error,req,res,next) => {
    if(error.status == 404 ){
        return res.render('pages/error/404',{flashMessage:{}})
    }
    console.log(error)
    return res.render('pages/error/500',{flashMessage:{},})
})




 const PORT = process.env.PORT || 5000;

 //database connnect 
 mongoose.connect(MongoUri,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true });

 const connection =mongoose.connection;
 connection.once('open',()=>{
     console.log('mongodb connection establish succesfully')
 });

 app.listen(PORT,()=>{console.log(`The app is running on port ${PORT}`)})

