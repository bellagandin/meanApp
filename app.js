const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

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
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('profile', () => {
        io.emit('profile','');
    });

    socket.on('post', () => {
        io.emit('post','');
    });


    socket.on('posts', () => {
        console.log("got message");
        io.emit('posts');
    });
});



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
http.listen(port, () => {
    console.log('Server started on port '+port);
});