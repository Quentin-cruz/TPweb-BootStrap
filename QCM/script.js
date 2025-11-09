var nombreQuestion = 10;
var question;
var score = 0;

function calculer() {
 score=0;
 for (var i = 1; i <= nombreQuestion; i++) {
    question = document.getElementsByName("q" + i);
    var correctAnswer = 0;
    for (var j = 0; j < question.length; j++) {
      if (question[j].checked) {
        if (question[j].value == "1") {
          question[j].parentElement.style.color = "green";
          correctAnswer = 1;
        } else {
          question[j].parentElement.style.color = "red";
        }
      }
    }
    if (correctAnswer == 1) {
      score++;
    }
 }

 var resultatElement = document.getElementById("resultat");
 resultatElement.textContent = " " + score + "/" + nombreQuestion + " ";
}

var boutonElement = document.getElementById("button");
boutonElement.addEventListener("click", calculer);

var timerElement = document.getElementById("timer");
var timeLeft = 5 * 60;
var timerInterval = setInterval(function() {
 timeLeft--;
 var minutes = Math.floor(timeLeft / 60);
 var seconds = timeLeft % 60;
 timerElement.textContent = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
 if (timeLeft === 0) {
    clearInterval(timerInterval);
    timerElement.textContent = "Temps écoulé!";
    boutonElement.disabled = true;
    document.addEventListener("click", function(event) {
      if (event.target.tagName === "INPUT" && event.target.type === "radio") {
        event.preventDefault();
      }
    });
    playSound();
 }
}, 1000);

function playSound() {
 var sound = new Audio("../sound/mario_death.mp3");
 sound.play();
}

window.onload = function() {
 alert("Tu as 5 minutes pour compléter le QCM !");
};