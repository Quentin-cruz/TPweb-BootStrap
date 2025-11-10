// ----- Configuration et variables globales -----
// Nombre total de questions du QCM
var nombreQuestion = 10;

// variable temporaire pour stocker le groupe d'inputs d'une question
var question;

// score total (nombre de bonnes réponses)
var score = 0;

// ----- Fonction de calcul du score -----
// Parcourt toutes les questions, vérifie les radios cochées,
// colorie la réponse sélectionnée (vert si correcte, rouge si incorrecte)
// et incrémente le score quand il y a une bonne réponse.
function calculer() {
  // Réinitialise le score à chaque appel (utile si on clique plusieurs fois)
  score = 0;

  // Boucle sur chaque question indexée de 1 à nombreQuestion
  for (var i = 1; i <= nombreQuestion; i++) {
    // Récupère tous les éléments <input> ayant pour name "q{i}" (ex: q1, q2, ...)
    question = document.getElementsByName("q" + i);

    // Indicateur : 1 si la bonne réponse a été sélectionnée pour cette question
    var correctAnswer = 0;

    // Parcourt chaque option (radio) de la question courante
    for (var j = 0; j < question.length; j++) {
      // Si l'option est cochée
      if (question[j].checked) {
        // Valeur "1" signifie ici que c'est l'option correcte
        if (question[j].value == "1") {
          // Colorie l'élément parent (généralement le label) en vert
          question[j].parentElement.style.color = "green";
          correctAnswer = 1;
        } else {
          // Si coché mais pas correct → colorie en rouge
          question[j].parentElement.style.color = "red";
        }
      }
    }

    // Si la bonne réponse a été cochée, on incrémente le score
    if (correctAnswer == 1) {
      score++;
    }
  }

  // Affiche le résultat sous la forme "score / nombreQuestion"
  var resultatElement = document.getElementById("resultat");
  resultatElement.textContent = " " + score + "/" + nombreQuestion + " ";
}

// ----- Liaison du bouton "valider" au calcul du score -----
// Récupère le bouton (id="button") et lui attache un écouteur qui lance calculer()
var boutonElement = document.getElementById("button");
boutonElement.addEventListener("click", calculer);

// ----- Minuteur (5 minutes) -----
// Récupère l'élément qui affichera le timer (id="timer")
var timerElement = document.getElementById("timer");

// Définit le temps en secondes : 5 minutes = 5 * 60
var timeLeft = 5 * 60;

// Démarre un intervalle qui se déclenche toutes les 1000 ms (1 seconde)
var timerInterval = setInterval(function() {
  // Décrémente le temps restant
  timeLeft--;

  // Calcul des minutes et secondes restantes pour affichage lisible
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;

  // Affiche le minuteur, en ajoutant un zéro si secondes < 10
  timerElement.textContent = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

  // Quand le temps arrive à zéro
  if (timeLeft === 0) {
    // Stoppe l'intervalle pour éviter des appels supplémentaires
    clearInterval(timerInterval);

    // Indique que le temps est écoulé
    timerElement.textContent = "Temps écoulé!";

    // Désactive le bouton de validation pour empêcher une soumission ultérieure
    boutonElement.disabled = true;

    // Empêche toute interaction future avec les radios (en ajoutant un écouteur global)
    // Si l'utilisateur clique une radio après le temps, on bloque son action.
    document.addEventListener("click", function(event) {
      if (event.target.tagName === "INPUT" && event.target.type === "radio") {
        event.preventDefault();
      }
    });

    // Joue un son pour signaler la fin du temps
    playSound();
  }
}, 1000);

// ----- Lecture d'un son -----
// Fonction simple qui crée un objet Audio et joue le fichier MP3
function playSound() {
  // Chemin relatif vers le fichier son (attention au chemin dans ton projet)
  var sound = new Audio("../sound/mario_death.mp3");
  sound.play();
}

// ----- Alerte au chargement de la page -----
// Lorsque la fenêtre est chargée, affiche une alerte informant le temps imparti
window.onload = function() {
  alert("Tu as 5 minutes pour compléter le QCM !");
};
