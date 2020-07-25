const base_url = "https://opentdb.com/api.php";
var quizzData;

let questionIndex = 0;
let correctAnswerIndex = 0;
let incorrectAnswerIndex = 1;
let currentAnswers = [];

let answers = [];
let questions = [];

function fetchedData(data) {
    quizzData = data;
    showquizzData();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showquizzData(){

    quizzData.results.forEach(element => questions.push(element.question))
    quizzData.results.forEach(element => answers.push(element.correct_answer, element.incorrect_answers));
    document.querySelector('.question').innerHTML = questions[questionIndex]

    currentAnswers.push(answers[correctAnswerIndex]);
    answers[incorrectAnswerIndex].forEach(element => currentAnswers.push(element))

    shuffleArray(currentAnswers)

    let selected = [];

    function select() {
        selected[0].classList.add('selected')
        if(selected[1]){
            selected[1].classList.remove('selected')
            selected.splice(1, 1)
        }
    }

    for (i = 0; i < 4; i++) {
        list = document.createElement('li');
        list.classList.add('questionList');
        document.getElementsByTagName('ul')[0].appendChild(list);
        list.innerHTML = currentAnswers[i]
      }

      const questionList = document.getElementsByClassName('questionList')

      for(let i = 0; i < questionList.length; i++){
          if(questionList[i].innerHTML === "undefined") {
              questionList[i].classList.add('none')
          } else {
              questionList[i].classList.remove('none')
          }

          if(questionList[i].innerHTML == answers[correctAnswerIndex]){
              questionList[i].classList.add('correct')
          }
      }

      for (let i = 0; i < questionList.length; i++) {
        questionList[i].addEventListener("click", function() {
           questionList[i].classList.add('selected')
        });
      }

      for (let i = 0; i < questionList.length; i++) {
        questionList[i].addEventListener("click", function() {
            if(questionList[i].innerHTML == answers[correctAnswerIndex]) {
                questionList[i].classList.add('correct')
            } else {
                
            }
            selected.unshift(questionList[i])
            select();
        });
      }
      

    currentAnswers= []
}  

function nextQuestion() {

    document.querySelector('.submit').disabled = false;


    quizzData.results.forEach(element => questions.push(element.question))

    questionIndex++
    correctAnswerIndex += 2;
    incorrectAnswerIndex += 2;

    let amount = document.querySelector('#amount').value

    if(amount) {
        if(questionIndex > amount - 2) {
            document.querySelector('.next').classList.add('none')
        }
        } else {
            if(questionIndex > 8) {
                document.querySelector('.next').classList.add('none')
            }
    }


        quizzData.results.forEach(element => questions.push(element.question))
        quizzData.results.forEach(element => answers.push(element.correct_answer, element.incorrect_answers));
        document.querySelector('.question').innerHTML = questions[questionIndex]
        const questionList = document.getElementsByClassName('questionList')
        

        for(let i = 0; i < questionList.length; i++) {
            questionList[i].classList.remove('correct')
        }

        currentAnswers.push(answers[correctAnswerIndex]);
        answers[incorrectAnswerIndex].forEach(element => currentAnswers.push(element))

        shuffleArray(currentAnswers)
        

        for(let i = 0; i < questionList.length; i++) {
            questionList[i].innerHTML = currentAnswers[i]
            questionList[i].classList.remove('correctAnswer')
            questionList[i].classList.remove('selected')
        }

        let selected = [];

        function select() {
            selected[0].classList.add('selected')
            if(selected[1]){
                selected[1].classList.remove('selected')
                selected.splice(1, 1)
            }
        }

        for(let i = 0; i < questionList.length; i++){
            if(questionList[i].innerHTML === "undefined") {
                questionList[i].classList.add('none')
            } else {
                questionList[i].classList.remove('none')
            }

            if(questionList[i].innerHTML == answers[correctAnswerIndex]){
                questionList[i].classList.add('correct')
            }
        }
        
        for (let i = 0; i < questionList.length; i++) {
            questionList[i].addEventListener("click", function() {
                if(questionList[i].innerHTML == answers[correctAnswerIndex]) {
                    questionList[i].classList.add('correct')
                } else {
                    
                }
                selected.unshift(questionList[i])
                select();
            });
        }

        currentAnswers= []

        document.querySelector('.next').disabled = true;
}

function submitAnswer() {
    let scoreCounter = document.getElementById('scoreCounter')

    const questionList = document.getElementsByClassName('questionList')

    for (let i = 0; i < questionList.length; i++) {
        if(questionList[i].classList.contains('selected') && questionList[i].classList.contains('correct')){
            scoreCounter.innerText++
        }
    }

    document.querySelector('.correct').classList.add('correctAnswer')
    document.querySelector('.correct').classList.remove('selected')
    document.querySelector('.next').disabled = false;


    document.querySelector('.submit').disabled = true;

    let amount = document.querySelector('#amount').value

    if(amount) {
        if(questionIndex > amount - 2) {
            document.querySelector('#questions').classList.add('animate__zoomOut')
            document.querySelector('.results-container').classList.add('animate__zoomIn')
            document.querySelector('.results-container').classList.remove('none')
            document.querySelector('.result').innerHTML = `Your total score: ${scoreCounter.innerHTML} / ${amount}`
        }
        } else {
            if(questionIndex > 8) {
                document.querySelector('#questions').classList.add('animate__zoomOut')
                document.querySelector('.results-container').classList.add('animate__zoomIn')
                document.querySelector('.results-container').classList.remove('none')
                document.querySelector('.result').innerHTML = `Your total score: ${scoreCounter.innerHTML} / 10`
            }
    }
}

function end() {
    location.reload();
    return false;
}

function getQuestions() {

    //DOM

    const inputCategory = document.querySelector("#category").value
    const inputDifficulty = document.querySelector("#difficulty").value
    const inputType = document.querySelector("#type").value
    const inputAmount = document.querySelector("#amount").value

    let category = '';
    let difficulty = '';
    let type = '';
    let amount = '';

    if(inputCategory !== '') {
        category = `&category=${inputCategory}`
    }else {
        category = '';
    }
    if(inputDifficulty !== '') {
        difficulty = `&difficulty=${inputDifficulty}`
    } else {
        difficulty = '';
    }
    if(inputType !== '') {
        type = `&type=${inputType}`
    } else {
        type = '';
    }
    if(inputAmount !== '') {
        amount = inputAmount
    } else {
        amount = "10"
    }

    fetch(`${base_url}?amount=${amount}${category}${difficulty}${type}`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        fetchedData(data);
    })

    document.querySelector('#form').classList.add('animate__zoomOut');
    setInterval(() => {
        document.querySelector('#form').classList.add('none');
        document.querySelector('#questions').classList.remove('none'); 
        document.querySelector('#questions').classList.add('animate__zoomIn'); 
    }, 600);
}
