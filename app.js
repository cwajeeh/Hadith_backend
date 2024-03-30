const path = require('path');
const express = require('express');
const authRoute = require('./routes/authRoute')

const app = express();
// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true, limit:'10kb'}));
// Data sanitization against NoSQL query injection


// 3) ROUTES
app.use('/auth', authRoute);



module.exports = app;