// Nombre total de questions du QCM
var nombreQuestion = 10;

// variable temporaire pour stocker les réponses aux questions
var question;

// nombre de bonnes réponses
var score = 0;

// ----- 🧮 Fonction de calcul du score -----
function calculer() {
  score = 0;
  // Boucle sur chaque question de 1 à nombreQuestion
  for (var i = 1; i <= nombreQuestion; i++) {
    // Récupère tous les éléments <input> ayant pour name "q{i}" (ex: q1, q2, ...)
    question = document.getElementsByName("q" + i);

    // variable pour savoir si la bonne réponse a été trouvée
    var correctAnswer = 0;

    // Parcourt chaque option de la question courante
    for (var j = 0; j < question.length; j++) {
      // Si l'option est cochée
      if (question[j].checked) {
        // Valeur "1" signifie ici que c'est la réponse est correcte
        if (question[j].value == "1") {
          // Colorie la réponse en vert
          question[j].parentElement.style.color = "green";
          correctAnswer = 1;
        } else {
          // Si la réponse n'est pas correcte on colorie en rouge
          question[j].parentElement.style.color = "red";
        }
      }
    }

    // Si la bonne réponse a été cochée on ajoute 1 au score
    if (correctAnswer == 1) {
      score++;
    }
  }

  // Affichage du résultat sous la forme "score / nombreQuestion"
  var resultatElement = document.getElementById("resultat");
  if (resultatElement) {
    resultatElement.textContent = " " + score + "/" + nombreQuestion + " ";
  }
}

// ----- Liaison du bouton "valider" au calcul du score -----
// Récupère le bouton (id="button") et lui attache un écouteur qui lance calculer()
var boutonElement = document.getElementById("button");
  if (boutonElement) {
    boutonElement.addEventListener("click", calculer);
}

// ----- 🕧 Minuteur (5 minutes) -----
// Récupère l'élément qui affichera le timer (id="timer")
var timerElement = document.getElementById("timer");

// Définit le temps en secondes : 5 minutes = 5 * 60
var timeLeft = 5 * 60;

// Variables pour le timer afin de pouvoir les contrôler proprement
var timerInterval = null;

// Fonction qui démarre le compte à rebours
function startTimer() {
  if (timerInterval !== null) return;

  timerInterval = setInterval(function () {
    // Retire du temps restant
    timeLeft--;

    // Calcul des minutes et secondes restantes pour affichage lisible
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;

    // Affiche le minuteur, en ajoutant un zéro si secondes < 10
    if (timerElement) {
      timerElement.textContent = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    // Quand le temps arrive à zéro
    if (timeLeft === 0) {
      // Stoppe l'intervalle pour éviter des appels supplémentaires
      clearInterval(timerInterval);
      timerInterval = null;

      // Indique que le temps est écoulé
      if (timerElement) {
        timerElement.textContent = "Temps écoulé!";
      }

      // Désactive le bouton de validation pour empêcher la saisie de nouvelles réponses
      if (boutonElement) {
        boutonElement.disabled = true;
      }

      // On bloque toutes actions sur les boutons
      document.addEventListener("click", function (event) {
        if (event.target.tagName === "INPUT" && event.target.type === "radio") {
          event.preventDefault();
        }
      });

      // Joue le son mario_death.mp3 pour signaler la fin du temps
      playSound();

      // Assure l'arrêt du fond sonore si on l'avait lancé
      stopBackgroundLooping();
    }
  }, 1000);
}

// ----- 🎶 Lecture d'un son (son de fin) 🎶 -----

// Fonction simple qui joue le fichier MP3 en boucle

function playSound() {
  var sound = new Audio("../Sounds/mario_death.mp3");
  sound.play().catch(function (err) {
    console.log("Impossible de jouer le son de fin :", err);
  });
}

// ----- 📢 Lecture en boucle du fond sonore pendant le QCM -----

var backgroundSound = new Audio("../Sounds/sound_effect.mp3");

// Active la lecture en boucle
backgroundSound.loop = true;

// Ajuste le volume si nécessaire (valeur entre 0.0 et 1.0)
backgroundSound.volume = 0.5;

// Durée totale du QCM (en secondes) : 4 min 59 = 299 secondes car on veut arrêter juste avant la fin (5 min)
var dureeTotale = 299;
var backgroundTimeoutId = null;

// Tente de démarrer la lecture du fichier audio lié à background
function tryStartBackgroundSound() {
  return backgroundSound.play().catch(function (err) {
    // Lecture bloquée — log en console
    console.log("Autoplay bloqué :", err);
    throw err;
  });
}

// Démarre la boucle audio et programme l'arrêt
function startBackgroundLooping() {
  // si déjà démarré on ne fait rien
  if (!backgroundSound.paused || backgroundTimeoutId !== null) return;

  tryStartBackgroundSound()
    .then(function () {
      // Programme l'arrêt après dureeTotale secondes
      backgroundTimeoutId = setTimeout(function () {
        backgroundSound.pause();
        backgroundSound.currentTime = 0;
        backgroundTimeoutId = null;
      }, dureeTotale * 1000);
    })
    .catch(function () {
      // Si le démarrage a échoué, le fallback utilisateur prendra le relais
    });
}

// Arrête le fond sonore proprement (utile quand le timer arrive à 0)
function stopBackgroundLooping() {
  if (backgroundTimeoutId !== null) {
    clearTimeout(backgroundTimeoutId);
    backgroundTimeoutId = null;
  }
  try {
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
  } catch (e) {
    console.log("Erreur lors de l'arrêt du backgroundSound :", e);
  }
}

// Si autoplay échoue, démarre  l'audio au premier clic 
function setupUserInteractionFallback() {
  // si la musique est déjà en train de jouer, on n'ajoute pas le fallback
  if (!backgroundSound.paused) return;

  // Fonction appelée au premier clic ou interaction
  var onFirstInteraction = function () {
    startBackgroundLooping();
    // Retire les écouteurs après la première interaction
    document.removeEventListener("click", onFirstInteraction);
    document.removeEventListener("keydown", onFirstInteraction);
    document.removeEventListener("touchstart", onFirstInteraction);
  };
  // Ajoute les écouteurs pour détecter la première interaction utilisateur
  document.addEventListener("click", onFirstInteraction);
  document.addEventListener("keydown", onFirstInteraction);
  document.addEventListener("touchstart", onFirstInteraction);
}

// ----- ℹ️ Écouteur unique sur le chargement de la page -----

// Remplace les multiples window.onload,  gère alerte, timer et son.
window.addEventListener("load", function () {
  // Informe l'utilisateur du temps imparti
  alert("Tu as 5 minutes pour compléter le QCM !");

  // Démarre le minuteur
  startTimer();

  // Tente de démarrer la musique de fond tout de suite (peut être bloqué)
  startBackgroundLooping();

  // Prépare le fallback si autoplay est bloqué
  setupUserInteractionFallback();
});