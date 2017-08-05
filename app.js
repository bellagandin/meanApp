const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//img
const fs = require('fs');

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');
const posts = require('./routes/posts');

// Port Number
const port = 3001;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
//app.use(app.use(bodyParser({uploadDir:'/path/to/temporary/directory/to/store/uploaded/files'})));
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./public/img'));

require('./config/passport')(passport);


app.use('/users', users);
app.use('/posts',posts);

// Index Route
  app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
