const startButton = document.getElementById('start')
const count = document.getElementById('count')
const typing = document.getElementById('typing')
const title = document.getElementById('title')
const ruby = document.getElementById('ruby')
const GameTimer = document.getElementById('game-timer')
const finish = document.getElementById('finish')
const keyCount = document.getElementById('key-count')
const typeMiss = document.getElementById('type-miss')
const difference = document.getElementById('difference')
const restart = document.getElementById('restart')
let thems
let wordNum = 0
let themeNum = 0
let correct = 0
let wrong = 0

const ReadJson = async () => {
    const res = await fetch('thems.json')
    const file = await res.json()
    thems = file
    Shuffle()
}
const Shuffle = () => {
    for (let i = thems.length; 1 < i; i--) {
        const index = Math.floor(Math.random() * i);
        [thems[index], thems[i - 1]] = [thems[i - 1], thems[index]]
    }
}
ReadJson()

startButton.onclick = () => {
    CountDown(3000, Date.now()) //カウントダウの秒数とカウントダウン開始時間を渡す
    count.classList.remove('none')
    startButton.classList.add('none')
}

const CountDown = (time, startTime) => {
    const timer = setInterval(() => {
        const endTime = Date.now()
        const diff = endTime - startTime
        const second = Math.ceil((time - diff) / 1000)
        count.textContent = second

        if (second <= 0) {
            count.classList.add('none')
            typing.classList.remove('none')
            GameStart()
            clearInterval(timer)
        }
    }, 1000)　//1秒ごとに実行
}

const GameStart = () => {
    title.textContent = thems[0].theme
    ruby.textContent = thems[0].ruby
    let timeLimit = 10　//好きな制限時間にしてください
    document.addEventListener('keydown', onKeyDown)
    const timer = setInterval(() => {
        timeLimit--
        GameTimer.textContent = timeLimit
        if (timeLimit <= 0) {
            Finish()
            clearInterval(timer)
        }
    }, 1000)
}
const onKeyDown = (e) => {
    if (e.key === thems[themeNum].ruby[wordNum].toLowerCase()) {　//入力した文字が合っていたら
        correct++
        wordNum++
        if (wordNum === thems[themeNum].ruby.length) {　//すべて打ち終わったら
            themeNum++
            title.textContent = thems[themeNum].theme
            wordNum = 0
            ruby.innerHTML = thems[themeNum].ruby
        }
        ruby.innerHTML = `<span style="color:red">${thems[themeNum].ruby.substr(0, wordNum)}</span>${thems[themeNum].ruby.substr(wordNum, thems[themeNum].ruby.length)}`
    } else {
        wrong++
    }
}

const Finish = () => {
    typing.classList.add('none')
    finish.classList.remove('none')
    keyCount.textContent = correct
    typeMiss.textContent = wrong
    const calc = (correct / (correct + wrong)) * 100
    difference.textContent = Math.floor(calc * 100) / 100
}

restart.onclick = () => {
    Shuffle()
    count.textContent = 3
    CountDown(3000, Date.now())
    finish.classList.add('none')
    count.classList.remove('none')
    wordNum = 0
    themeNum = 0
    correct = 0
    wrong = 0
}