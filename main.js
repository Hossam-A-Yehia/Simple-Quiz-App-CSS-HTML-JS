let bulletsSpansContainer = document.querySelector(".bullets .spans")
let bullets = document.querySelector(".bullets")
let spansCount = document.querySelector(".count span")
let quizArea = document.querySelector(".quiz-area")
let answerArea = document.querySelector(".answer-area")
let submitButton = document.querySelector(".submit-button")
let resultContainer = document.querySelector(".results")
let currentIndex = 0;
let rightAnswer = 0
let theChoosenAnswer;
let countdownInteval;


function getQuestions() {
    let myReguest = new XMLHttpRequest

    myReguest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText)
            let questionCount = questionObject.length
            createBullets(questionCount)

            addQuestionsData(questionObject[currentIndex], questionCount)

            countdown(4, questionCount)
            submitButton.onclick = () => {
                let answerRight = questionObject[currentIndex].right_answer
                currentIndex++
                checkAnswer(answerRight, questionCount)

                quizArea.innerHTML = ""
                answerArea.innerHTML = ""
                addQuestionsData(questionObject[currentIndex], questionCount)
                handleBullets(answerRight)
                showResult(questionCount)
                clearInterval(countdownInteval)
                countdown(4, questionCount)

            } 
        }
    }
    myReguest.open("GET", "Answer.json", true)
    myReguest.send()
}
getQuestions()
function createBullets(num) {
    spansCount.innerHTML = num

    for (let i = 0; i < num; i++) {
        let theBullets = document.createElement("span")

        if(i === 0) {
            theBullets.className = "on"
        }
        bulletsSpansContainer.appendChild(theBullets)
    }

}

function addQuestionsData(obj, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2") 
    let questionText = document.createTextNode(obj.title)
    questionTitle.appendChild(questionText)
    quizArea.appendChild(questionTitle)


    for (let i = 1; i <= 4; i++) {

        // Create Main Div
        let mainDiv = document.createElement("div")
        mainDiv.className = "answer"

        // Create Radio Input
        let radioInput = document.createElement("input")
        radioInput.name = "question"
        radioInput.type = "radio"
        radioInput.id = `answer_${i}`
        radioInput.dataset.answer = obj[`answer_${i}`]

        if (i === 1) {
            radioInput.checked = true
        }

        // Create Label 
        let label = document.createElement("label")
        label.htmlFor = `answer_${i}`
        let labetText = document.createTextNode(obj[`answer_${i}`])
        label.appendChild(labetText)

        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(label)
        answerArea.appendChild(mainDiv)
    }
    }
}

function checkAnswer (rAnswer, count) {
    let answers = document.getElementsByName("question")

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswer++
        console.log("Good")
    }

}

function handleBullets(rAnswer) {
    let spansBullets = Array.from(document.querySelectorAll(".bullets .spans span"))

    spansBullets.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on"
        }
        
    })
}

function showResult(qCount) {
    let result;
    if (currentIndex === qCount) {
        quizArea.remove()
        answerArea.remove()
        submitButton.remove()
        bullets.remove()

        if (rightAnswer > qCount / 2 && rightAnswer < qCount) {
            result = `<span class="good">Good</span>, ${rightAnswer} From ${qCount}`
        } else if (rightAnswer === qCount) {
            result = `<span class="perfect">Perfect</span>, All Answer Is Good`
        } else {
            result = `<span class="bad">Bad</span>, ${rightAnswer} From ${qCount}`
        }
        resultContainer.innerHTML = result
        resultContainer.style.padding = "20px"
        resultContainer.style.backgroundColor = "white"
        resultContainer.style.marginTop = "10px"
    }

}

function countdown (duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInteval = setInterval(function () {
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)
            
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds

            document.querySelector(".countdown").innerHTML = `${minutes}:${seconds}`

            if (--duration < 0) {
                clearInterval(countdownInteval)
                submitButton.click()
            }
        }, 1000)
    }   
}