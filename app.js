const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/",function(req,res){
    res.render('index');
})

app.get("/game",function(req,res){
    res.send("Strat the ga,e");
})

server = app.listen(3000,function(){
    console.log("Server running");
});

const io = require('socket.io')(server);

var users = [];
const users_id = {};

io.on('connection',function(socket){
    socket.on('new-user',function(name){
        users.push(name);
        users_id[socket.id] = name;
        io.sockets.emit('user-connected',users);
    });
    socket.on('start',function(data){
        io.sockets.emit('start-game');
    })
    socket.on('disconnect',function(){
        id_to_delete = users_id[socket.id];
        var index = users.indexOf(id_to_delete);
        users.splice(index,1);
        socket.broadcast.emit('user-disconnected',users);
    });
});