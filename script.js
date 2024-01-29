let currentQuestionIndex = 0;
let currentQuestion;
let totalMoney = 0;
let halfHalfUsed = false;
let callFriendUsed = false;
let originalAnswers;
let jokerUsed = false;
let halfHalfTimer;

function startGame() {
  getNextQuestion();
  showQuestion();
  clearResult();
  resetHalfHalfAnswers(); // Dodano resetiranje odgovora pri početku nove igre
}

function showQuestion() {
  document.getElementById("question").innerText = currentQuestion.question;
  updateCurrentMoney();

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  originalAnswers = [...currentQuestion.answers];

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("option");
    button.setAttribute("data-correct", answer.correct);
    button.onclick = () => checkAnswer(answer.correct);
    optionsContainer.appendChild(button);
  });

  updateHelperButtons();
}

function checkAnswer(isCorrect) {
  const moneyForCurrentQuestion = getMoneyForCurrentQuestion();

  if (isCorrect) {
    totalMoney = moneyForCurrentQuestion;
    showResult(
      "Točan odgovor! Osvojili ste " + formatMoney(totalMoney) + " EUR."
    );
  } else {
    totalMoney = 0;
    showResult(
      "Nažalost, krivi odgovor. Kraj igre. Osvojili ste " +
        formatMoney(totalMoney) +
        " EUR."
    );
    setInterval(function(){showResult(
      "Nažalost, krivi odgovor. Kraj igre. Osvojili ste " +
        formatMoney(totalMoney) +
        " EUR."
    )},5000);
    setInterval(function(){resetGame()},2000);
  }

  highlightCorrectAnswer();

  setTimeout(() => {
    getNextQuestion();
    showQuestion();
    clearResult();
  }, 2000);
}

function getMoneyForCurrentQuestion() {
  // Funkcija koja vraća iznos za trenutno pitanje na temelju indeksa
  const moneyLevels = [
    10, 20, 50, 100, 150, 300, 600, 1000, 2500, 5000, 10000, 18000, 34000,
    68000, 150000,
  ];
  return moneyLevels[currentQuestionIndex - 1] || 0;
}

function highlightCorrectAnswer() {
  const correctButton = document.querySelector('.option[data-correct="true"]');
  correctButton.style.backgroundColor = "#2ecc71";
  correctButton.style.color = "white";
}

function getNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    currentQuestion = questions[currentQuestionIndex];
    currentQuestionIndex++;
  } else {
    showResult(
      "Čestitamo! Osvojili ste maksimalni iznos od " +
        formatMoney(totalMoney) +
        " EUR."
    );
    resetGame();
  }
}

function useJoker() {
  if (!jokerUsed) {
    const correctAnswer = currentQuestion.answers.find(
      (answer) => answer.correct
    );
    showResult("Joker: Odgovor je " + correctAnswer.text + "!");
    jokerUsed = true;
    checkAnswer(true); // Automatically check the correct answer
    updateHelperButtons(); // Disable the joker button after use
    document.getElementById("jokerBtn").classList.add("used-helper"); // Add the used-helper class to style the button
  }
}

function resetGame() {
  currentQuestionIndex = 0;
  totalMoney = 0;
  halfHalfUsed = false;
  callFriendUsed = false;
  currentQuestion = null;

  document.getElementById("halfHalfBtn").classList.remove("used-helper");
  document.getElementById("callFriendBtn").classList.remove("used-helper");
  document.getElementById("jokerBtn").classList.remove("used-helper");
  
  //odvedi na glavni page
  window.location.href = "glavna.html";
}

function formatMoney(amount) {
  return amount.toLocaleString("hr-HR", { style: "currency", currency: "EUR" });
}

function updateCurrentMoney() {
  document.getElementById("current-money").innerText =
    "Trenutno osvojeno: " + formatMoney(totalMoney);
}

function updateHelperButtons() {
  document.getElementById("halfHalfBtn").disabled = halfHalfUsed;
  document.getElementById("callFriendBtn").disabled = callFriendUsed;

  if (halfHalfUsed) {
    document.getElementById("halfHalfBtn").classList.add("used-helper");
  }

  if (callFriendUsed) {
    document.getElementById("callFriendBtn").classList.add("used-helper");
  }
}

function showResult(message) {
  const resultContainer = document.getElementById("result-container");
  const resultElement = document.getElementById("result");
  resultElement.innerText = message;
  resultContainer.style.display = "flex";
}

function clearResult() {
  const resultContainer = document.getElementById("result-container");
  const resultElement = document.getElementById("result");
  resultElement.innerText = "";
  resultContainer.style.display = "none";
}

function endGame() {
  showResult(
    "Hvala na igri! Osvojili ste " + formatMoney(totalMoney) + " EUR."
  );
  clearResult();
  resetGame();
}

function halfHalf() {
  if (!halfHalfUsed) {
    const wrongAnswers = currentQuestion.answers.filter(
      (answer) => !answer.correct
    );
    const randomWrongAnswer =
      wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];

    currentQuestion.answers = currentQuestion.answers.filter(
      (answer) => answer.correct || answer === randomWrongAnswer
    );

    halfHalfUsed = true;

    showQuestion();

    if (halfHalfTimer) {
      clearTimeout(halfHalfTimer);
    }

    halfHalfTimer = setTimeout(() => {
      resetHalfHalfAnswers();
      showQuestion();
    }, 5000);
  }
}

function resetHalfHalfAnswers() {
  currentQuestion.answers = [...originalAnswers];
  halfHalfUsed = false;
}

function callFriend() {
  if (!callFriendUsed) {
    const isCorrectAnswer = Math.random() <= 0.7;

    showResult(
      "Zovi Prijatelja: Prijatelj kaže da smatra da je točan odgovor: " +
        (isCorrectAnswer
          ? currentQuestion.answers.find((a) => a.correct).text
          : getRandomWrongAnswer())
    );

    callFriendUsed = true;

    updateHelperButtons();
  }
}

function getRandomWrongAnswer() {
  const wrongAnswers = currentQuestion.answers.filter(
    (answer) => !answer.correct
  );
  return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)].text;
}
const questions = [
  {
    question:
      "1. Koja je od navedenih TV voditeljica godine 2001. istrčala Pariški maraton?",
    answers: [
      { text: "Mirjana Hrga", correct: false },
      { text: "Sandra Antolić", correct: true },
      { text: "Mirna Zidarić", correct: false },
      { text: "Ines Preindl", correct: false },
    ],
    money: 10,
  },
  {
    question: "2. Koji se američki predsjednik pojavio u showu Laugh-in?",
    answers: [
      { text: "Lyndon Johnson", correct: false },
      { text: "Richard Nixon", correct: true },
      { text: "Jimmy Carter", correct: false },
      { text: "Gerald Ford", correct: false },
    ],
    money: 20,
  },
  {
    question: "3. Prema kome nije nazvan ni jedan kemijski element?",
    answers: [
      { text: "Enrico Fermi", correct: false },
      { text: "Niels Bohr", correct: false },
      { text: "Isaac Newton", correct: true },
      { text: "Glenn T. Seaborg", correct: false },
    ],
    money: 50,
  },
  {
    question: "4. Koji je engleski kralj bio oženjen Eleonorom od Akvitanije",
    answers: [
      { text: "Henrik I.", correct: false },
      { text: "Henrik V.", correct: true },
      { text: "Henrik II.", correct: false },
      { text: "Richard I.", correct: false },
    ],
    money: 100,
  },
  {
    question: " 5. Odakle je medvjedić Paddington iz poznate dječje priče?",
    answers: [
      { text: "Hrvatske", correct: false },
      { text: "Kanade", correct: false },
      { text: "Indije", correct: false },
      { text: "Perua", correct: true },
    ],
    money: 150,
  },
  {
    question: " 6. Oberon je prirodni satelit kojeg planeta?",
    answers: [
      { text: "Urana", correct: true },
      { text: "Neptuna", correct: false },
      { text: "Marsa", correct: false },
      { text: "Merkura", correct: false },
    ],
    money: 300,
  },
  {
    question:
      " 7. Američka ikona - lik Uncle Sama, inspiriran je stvarnom osobom Samuelom Willsonom koji je tijekom rata 1812. radio kao što?",
    answers: [
      { text: "poštar", correct: false },
      { text: "inspektor za meso", correct: true },
      { text: "dostavljač", correct: false },
      { text: "povjesničar", correct: false },
    ],
    money: 600,
  },
  {
    question:
      " 8. Koji je gusar umro 1718. kod obale današnje Sjeverne Karoline?",
    answers: [
      { text: "Blackbeard", correct: true },
      { text: "Captain Kidd", correct: false },
      { text: "Calico Jack", correct: false },
      { text: "Bartolomew Roberts", correct: false },
    ],
    money: 1000,
  },
  {
    question:
      " 9. Na kojem jeziku je originalno objavljen Dnevnik Anne Frank? ",
    answers: [
      { text: "Njemačkom", correct: false },
      { text: "Francuskom", correct: false },
      { text: "Nizozemskom", correct: true },
      { text: "Englesokm", correct: false },
    ],
    money: 2500,
  },
  {
    question:
      " 10.Koja je nagrađivana književnica rođena pod imenom Howard Allen O'Brien?",
    answers: [
      { text: "J.K. Rowling", correct: false },
      { text: "Danielle Steel", correct: false },
      { text: "Anne Rice", correct: true },
      { text: "Toni Morrison", correct: false },
    ],
    money: 5000,
  },
  {
    question:
      " 11. Koji je od navedenih Nobelovaca jedini osvojio i nagradu Oscar?",
    answers: [
      { text: "George Bernard Shaw", correct: true },
      { text: "John Steinback", correct: false },
      { text: "Toni Morrison", correct: false },
      { text: "Jean-Paul Sartre", correct: false },
    ],
    money: 10000,
  },
  {
    question:
      " 12. Pjesma 'God Bless America' originalno napravljen aza koji mjuzikl iz 1918. godine?",
    answers: [
      { text: "Blossom Time", correct: false },
      { text: "Oh, Lady! Lady!", correct: false },
      { text: "Watch Your Step", correct: false },
      { text: "Yip, Yip, Yaphank", correct: true },
    ],
    money: 18000,
  },
  {
    question:
      " 13. U preiodnom sustavu elemenata postoje četiri elementa koja su dobila ime po čemu?",
    answers: [
      { text: "Mački", correct: false },
      { text: "Neptunovom mjesecu", correct: false },
      { text: "Srednjem imenu Marie Curie", correct: false },
      { text: "Rudarsko  selu u Švdeskoj", correct: true },
    ],
    money: 34000,
  },
  {
    question:
      " 14. Tko se izvrgava opasnosti za drugoga, taj vadi kestene iz...",
    answers: [
      { text: "Šume", correct: false },
      { text: "vode", correct: false },
      { text: "nabujale rijeke", correct: false },
      { text: "vatre", correct: true },
    ],
    money: 68000,
  },
  {
    question: " 15. Nakon odsviranog koncerta gotovo uvijek slijedi...",
    answers: [
      { text: "bis", correct: true },
      { text: "dis", correct: false },
      { text: "fis", correct: false },
      { text: "cis", correct: false },
    ],
    money: 150000,
  },
];
