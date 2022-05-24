const EventManager = require('events')
const event = new EventManager()

//вытаскиваем из строки нужные данные
const [hour, day, mount, year] = process.argv[2].split('-')

/**
 * делаем правильную строку по формату ISO
 * @returns {string}
 */
function createTimeString() {
    return `${year}-${mount}-${day}T${hour}:00:00`
}

/**
 * считаем сколько осталось времени
 * @param endtime
 * @returns {string}
 */
function getTimeRemaining(endtime) {
    if ((Date.parse(endtime) === Date.parse(new Date())) || (Date.parse(endtime) < Date.parse(new Date()))) {
        console.log('Ваше время вышло')
        return false
    } else {
        const t = Date.parse(endtime) - Date.parse(new Date())
        const years = Math.floor((t / 1000) / 31536000)
        const mounts = Math.floor((t / 1000) / 2592000)
        const days = Math.floor(t / (1000 * 60 * 60 * 24)) - Math.floor(mounts * 30)
        const hours = Math.floor(t / (1000 * 60 * 60) % 24)
        const minutes = Math.floor((t / 1000 / 60) % 60)
        const seconds = Math.floor((t / 1000) % 60)

        return `До конца осталось ${years} лет, ${mounts} месяцев, ${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд`
    }
}

/**
 * запускаем функцию подсчета
 */
function run() {
    let int
    while (getTimeRemaining(createTimeString())) {
        event.on('timer', message => console.log(message))
        event.emit('timer', getTimeRemaining(createTimeString()))
        int = setInterval(() => run(), 1000)
    }
    clearInterval(int)
    process.exit()
}

/**
 * формат таймера часы-число-месяц-год, напр: 20-24-05-2022
 */
run()