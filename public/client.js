document.addEventListener("DOMContentLoaded",function(){

    var socket = io.connect();
    container = document.getElementById('container');

    socket.on("user-list",function(users){
        console.log(users);
    });

    // Chat feature
    var messageInput = document.getElementById('message'); //messagebox message-input (both inside send-container)
    var send_message = document.getElementById('send_message'); //sendbutton 
    var chatroom = document.getElementById("chatroom"); //Mesage display box (message container)
    var messageForm = document.getElementById('send_container');

    socket.on('chat-message',data => {
        appendMessage(`${data.message}`);
    })

    messageForm.addEventListener('submit',e => {
        e.preventDefault()
        const message = messageInput.value;
        appendMessage(`You: ${message}`)
        socket.emit('send-chat-message',message);
        messageInput.value = "";
    })
    
    function appendMessage(message){
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        chatroom.append(messageElement);
        messageElement.style.cssText = "background-color: #81DAF5;font-size:25px;";
    }

    //Drawing feature

    var mouse = {
        click: false,
        move: false,
        pos: {x:0,y:0},
        pos_prev: false
    };

    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = 550;
    var socket = io.connect();
    
    context.fillStyle = "orange";
    canvas.width = width;
    canvas.height = height;

    canvas.onmousedown = function(e){
        mouse.click = true;
    }
    canvas.onmouseup = function(e){
        mouse.click = false;
    }
    canvas.onmousemove = function(e){
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    }

    socket.on('draw_line',function(data){
        var line = data.line;
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * width,line[0].y * height);
        context.lineTo(line[1].x * width,line[1].y * height);
        context.stroke();
    });

    function mainLoop(){
        if(mouse.click && mouse.move && mouse.pos_prev){
            socket.emit('draw_line',{ line: [mouse.pos,mouse.pos_prev]});
            mouse.move = false;
        }
        mouse.pos_prev = {x:mouse.pos.x,y:mouse.pos.y};
        setTimeout(mainLoop,25);
    }
    mainLoop();
});