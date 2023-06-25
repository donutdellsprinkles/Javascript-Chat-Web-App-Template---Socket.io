var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;
var imageInput;
var selectedImage;

document.addEventListener("DOMContentLoaded", function() {
  onload();
});

document.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    Send();
  }
});

function onload() {
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");
  imageInput = document.getElementById("ImageInput");

  socket.on("join", function(room) {
    chatRoom.innerHTML = "Chatroom : " + room;
  });

  socket.on("receive", function(data) {
    console.log(data);
    if (messages.length < 9) {
      messages.push(data);
      dingSound.currentTime = 0;
      dingSound.play();
    } else {
      messages.shift();
      messages.push(data);
    }
    displayMessages();
  });
}

function displayMessages() {
  for (var i = 0; i < messages.length; i++) {
    var messageData = messages[i];
    var name = messageData.name;
    var content = messageData.content;
    var image = messageData.image;

   var messageElement = document.getElementById("Message" + i);
messageElement.innerHTML =
  '<span class="message-content">' + content + '</span>' + ' : ' + '<span class="name">' + name + '</span>';

    if (image) {
      var imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.style.maxWidth = "50px"; // Set the maximum width of the image
      imageElement.style.maxHeight = "50px"; // Set the maximum height of the image
      imageElement.style.borderRadius = "5px"
      messageElement.appendChild(imageElement);
    }

    messageElement.style.color = "#FFFDD0";
    messageElement.style.fontFamily = "Simp";
  }
}

function Connect() {
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

function Send() {
  if (delay && messageInput.value.replace(/\s/g, "") !== "") {
    delay = false;
    setTimeout(delayReset, 1000);

    var messageData = {
      content: messageInput.value,
      image: selectedImage
    };
    socket.emit("send", messageData);
    messageInput.value = "";
  }
}

function delayReset() {
  delay = true;
}

function handleImageSelect(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    selectedImage = event.target.result;
  };
  reader.readAsDataURL(file);
}
