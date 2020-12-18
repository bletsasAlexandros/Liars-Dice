const socket = io();

//Query DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

//Emit Event
btn.addEventListener('click',()=>{
    socket.emit('chat',{
        message: message.value,
        handle: handle.value
    });
    message.innerHTML = "";
})


//Listen for events
socket.on('chat',(data)=>{
    console.log(data.message)
    output.innerHTML += '<p><strong>'+data.handle+':</strong>'+data.message+'</p>';
    feedback.innerHTML = "";    
})
