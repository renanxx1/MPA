const express = require('express');
const app = express();
const http = require('http').createServer(app);
global.io = require('socket.io')(http);
global.internalIp = require('internal-ip').v4();
const bodyParser = require('body-parser');
var sharedsession = require("express-socket.io-session");

var session = require("express-session")({
    secret: "MPA-secret",
    resave: true,
    saveUninitialized: false
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
io.use(sharedsession(session));
app.use(session);

app.use('/', require('./routes/LoginRouter'));
app.use('/', require('./routes/ActivityRouter'));
app.use('/', require('./routes/ProcessRouter'));
app.use('/', require('./routes/CollaboratorRouter'));
app.use('/', require('./routes/AdminRouter'));
app.use('/', require('./routes/CollectorRouter'));
app.use('/', require('./routes/DashboardRouter'));
app.use('/', require('./routes/FlowRouter'));
app.use('/', require('./routes/NotFoundRouter'));

http.listen(80, () => {
    console.log("Servidor rodando!");
})
