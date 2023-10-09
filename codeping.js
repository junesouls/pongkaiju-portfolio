
document.addEventListener("DOMContentLoaded", function () {
  var playButton = document.getElementById("play-image"); 
  playButton.addEventListener("click", playAudio);
});

function redirecttodif() {
  window.location.href = "sedif.html";
}

document.getElementById("gotogame").onclick = gotoponggame;
function gotoponggame(){
  window.location.href = "GamePongnor.html";
}

document.getElementById("gotoaigame").onclick = gotopongsgame;
function gotopongsgame(){
  window.location.href = "pongAI.html";
}
document.getElementById("gotokaiju").onclick = gotopongssgame;
function gotopongssgame(){
  window.location.href = "pongkaiju.html";
}