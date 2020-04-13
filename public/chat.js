var socket = io.connect();
const name = prompt('What is your name?');

socket.emit('new-user',name);
container = document.getElementById('container');

socket.on('user-connected',function(users){
    container.innerHTML = '';
    users.forEach(element => {
        const listElement = document.createElement('li');
        listElement.innerText = element;
        container.append(listElement);
    });  
});

socket.on('user-disconnected',function(users){
    container.innerHTML = '';
    users.forEach(element => {
        const listElement = document.createElement('li');
        listElement.innerText = element;
        container.append(listElement);
    });  
});

socket.on('start-game',function(){
    window.open("game");
})
function clickFunc(){
    socket.emit('start',name);
}