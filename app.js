const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/",function(req,res){
    res.render('index');
})

app.get("/game",function(req,res){
    res.render("draw",{usersList:users});
})

server = app.listen(3000,function(){
    console.log("Server running");
});

const io = require('socket.io')(server);

var users = [];
const users_id = {};
var line_history = [];

io.on('connection',function(socket){
    socket.on('new-user',function(name){
        users.push(name);
        users_id[socket.id] = name;
        io.sockets.emit('user-connected',users);
    });
    socket.on('lobby-leader',function(){
        io.sockets.emit('button-spawn',users);
    })
    socket.on('start',function(data){
        io.sockets.emit('start-game');
    });
    socket.on('disconnect',function(){
        id_to_delete = users_id[socket.id];
        var index = users.indexOf(id_to_delete);
        users.splice(index,1);
        socket.broadcast.emit('user-disconnected',users);
    });
    for(var i in line_history){
        socket.emit('draw_line',{line:line_history[i]});
    }

    socket.on('draw_line',function(data){
        line_history.push(data.line);
        io.emit('draw_line',{line:data.line});
    });

    socket.on('fetch-user-list',function(){
        console.log(users);
        io.sockets.emit('user-list',users);
    });

    socket.on('send-chat-message',(message) => {
        socket.broadcast.emit('chat-message',{message: message, name:users[socket.id]});
    });
});