const express = require('express');
const app = express();
const connectDb = require('./config/db');

//Connect to Database
connectDb();

app.use(express.json({extended: 'false'}));

//routes
//for the post routes to create new short url
app.use('/', require('./routes/index'));
//for storing the short urls
app.use('/api/url', require('./routes/url'));

const port = 4444;

app.listen(port, ()=> console.log(`Server started at port ${port}`));