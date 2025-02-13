const rQuestion = document.querySelector(".rQuestion");
const options = document.querySelector(".options");
const nextBtn = document.querySelector(".nextBtn");
const quesStatus = document.querySelector(".quesStatus");
const timeLimit = document.querySelector(".timeLimit");
const resultContainer = document.querySelector(".resultContainer");
const quizContainer = document.querySelector(".quizContainer");
const resultMsg = document.querySelector(".resultMsg");
const quizConfiguration = document.querySelector(".quizConfiguration");
const tryAgainBtn = document.querySelector(".tryAgainBtn");
const startBtn = document.querySelector(".startBtn");

const quizTimeLimit = 10;
let currentTime = quizTimeLimit;
let timer = null;
let correctAnsCount = 0;

let quizCategory = "programming";
let numberOfQuestion = 5;
let currentQuestion = null;
let questionIndexHistory = [];
// let count = 0;

const startTimer = () => {
  clearInterval(timer);
  currentTime = quizTimeLimit;
  timeLimit.innerHTML = `${currentTime}s`;

  timer = setInterval(() => {
    currentTime--;

    if (currentTime <= 0) {
      clearInterval(timer);
      timeLimit.innerHTML = "Time's up!";
      disableOptions();
      const correctOption = options.children[currentQuestion.correctAnswer];
      correctOption.classList.add("correct");
      let checkIcon = document.createElement("span");
      correctOption.appendChild(checkIcon);
      checkIcon.innerHTML =
        '<i class="fa-regular fa-circle-check text-green-600"></i>';
    } else {
      timeLimit.innerHTML = `${currentTime}s`;
    }
  }, 1000);
};
const correctAnswerCheck = () => {
  const correctOption = options.children[currentQuestion.correctAnswer];

  if (correctOption !== option) {
    let checkIcon = document.createElement("span");
    correctOption.appendChild(checkIcon);
    checkIcon.innerHTML =
      '<i class="fa-regular fa-circle-check text-green-600"></i>';
    correctOption.classList.add("correct");
  }
};
const disableOptions = () => {
  Array.from(options.children).forEach((item) => {
    item.style.pointerEvents = "none";
  });
  nextBtn.style.visibility = "visible";
};

const quizResult = () => {
  nextBtn.style.visibility = "hidden";
  resultContainer.style.display = "flex";
  quizContainer.style.display = "none";
  resultMsg.innerHTML = `You answered <b>${correctAnsCount}</b> questions correctly out of <b>${numberOfQuestion}</b> questions. Great effort.`;
};

function getRandomQuestion() {
  const categoryQuestions =
    questions.find((cat) => {
      return cat.category.toLowerCase() === quizCategory.toLowerCase();
    }).questions || [];

  if (
    questionIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestion)
  ) {
    return quizResult();
  }

  const availableQuestion = categoryQuestions.filter(
    (_, index) => !questionIndexHistory.includes(index)
  );
  if (availableQuestion.length === 0) {
    return quizResult();
  }
  const randomQuestion =
    availableQuestion[Math.floor(Math.random() * availableQuestion.length)];
  questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
}

function handleAnswer(option, answerIndex) {
  clearInterval(timer);
  let isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "error");
  Array.from(options.children).forEach((item) => {
    item.style.pointerEvents = "none";
  });

  let icon = document.createElement("span");
  option.appendChild(icon);
  icon.innerHTML = isCorrect
    ? '<i class="fa-regular fa-circle-check text-green-600"></i>'
    : '<i class="fa-regular fa-circle-xmark text-red-600"></i>';
  option.classList.add(isCorrect ? "correct" : "error");

  const correctOption = options.children[currentQuestion.correctAnswer];

  if (correctOption !== option) {
    let checkIcon = document.createElement("span");
    correctOption.appendChild(checkIcon);
    checkIcon.innerHTML =
      '<i class="fa-regular fa-circle-check text-green-600"></i>';
    correctOption.classList.add("correct");
  } else {
    correctAnsCount++;
  }
  nextBtn.style.visibility = "visible";
}

function renderQuestion() {
  nextBtn.style.visibility = "hidden";
  currentQuestion = getRandomQuestion();
  rQuestion.innerHTML = currentQuestion.question;
  options.innerHTML = "";
  quesStatus.innerHTML = `<span class="">${questionIndexHistory.length}</span> of ${numberOfQuestion} questions`;
  startTimer();
  // =======quesStatus

  currentQuestion.options.map((item, index) => {
    const li = document.createElement("li");
    options.appendChild(li);
    li.classList.add("optionStyle");
    li.textContent = item;
    li.addEventListener("click", () => handleAnswer(li, index));
    console.log(li);
  });
}

function resetQuiz() {
  // currentQuestion = 0;
  correctAnsCount = 0;
  questionIndexHistory.length = 0;
  quizConfiguration.style.display = "flex";
  resultContainer.style.display = "none";
}

document
  .querySelectorAll(".categoryOption, .questionOption")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });
function startQuiz() {
  quizCategory = quizConfiguration
    .querySelector(".categoryOption.active")
    .textContent.trim();
  numberOfQuestion = parseInt(
    quizConfiguration.querySelector(".questionOption.active").textContent
  );
  quizContainer.style.display = "block";
  quizConfiguration.style.display = "none";
  renderQuestion();
}

nextBtn.addEventListener("click", () => {
  renderQuestion();
});
tryAgainBtn.addEventListener("click", () => {
  resetQuiz();
});
startBtn.addEventListener("click", () => {
  startQuiz();
});
