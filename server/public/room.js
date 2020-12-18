var roomName = document.getElementById('room-name'),
    btn = document.getElementById('sendRoom'),
    user = document.getElementById('avatar');

btn.addEventListener('click',()=>{
    var room = roomName.value;
    socket.emit('join-room',{
        roomName: room,
        user: avatar
    });
})