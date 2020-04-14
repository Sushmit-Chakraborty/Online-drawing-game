var socket = io.connect();
const name = prompt('What is your name?');
var body = document. getElementsByTagName("body")[0];

socket.emit('new-user',name);
container = document.getElementById('container');

socket.emit('lobby-leader');

socket.on('user-connected',function(users){
    container.innerHTML = '';
    users.forEach(element => {
        const listElement = document.createElement('li');
        listElement.innerText = element;
        container.append(listElement);
    });  
});

socket.on('button-spawn',function(data){
    if(data.indexOf(name) === 0){
        var button = document.createElement('button');
        if(document.contains(document.getElementById('start-button')) === false){
            button.setAttribute("id","start-button");
            button.innerHTML = "CLICK ME MOW";
            button.onclick = clickFunc;
            body.appendChild(button);
        }
    }
})

socket.on('user-disconnected',function(users){
    container.innerHTML = '';
    users.forEach(element => {
        const listElement = document.createElement('li');
        listElement.innerText = element;
        container.append(listElement);
    });  
});

socket.on('start-game',function(){
    window.open("game", "_self");
})
function clickFunc(){
    socket.emit('start',name);
}