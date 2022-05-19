const {green, yellow, red} = require("colors/safe");

const isPrime = (number) => {
    if (number < 2) return false;

    for (let i = 2; i <= number / 2; i++) {
        if (number % i === 0) return false;
    }

    return true;
};


let count = 1;

const from = process.argv[2];
const to = process.argv[3];

/**
 * Функция проверяет диапазон на простые числа
 * @param from
 * @param to
 * @returns {boolean}
 */
function thereArePrimeNumbers(from, to) {
    const arr = []
    for (let i = from; i <= to; i++) {
        arr.push(i)
    }
    if (arr.some(el => isPrime(el))) {
        return true
    } else {
        console.log(red('В данном диапазоне нет простых чисел'))
        return false
    }
}

/**
 * Функция проверяет число ли это
 * @param number
 * @returns {boolean}
 */
function isNumber(number) {
    return !isNaN(number)
}

/**
 * Функция валидации параметров
 * @param from
 * @param to
 * @returns {boolean}
 */
function validatedParameters(from, to) {
    if (!isNumber(from) && !isNumber(to)) {
        console.log(red('Оба значения должны являться числом'))
        return false
    } else if (!isNumber(from)) {
        console.log(red('Первое значение должно также являться числом'))
        return false
    } else if (!isNumber(to)) {
        console.log(red('Второе значение должно также являться числом'))
        return false
    } else if (to < from) {
        console.log(red('Первое значение должно быть меньше второго'))
        return false
    } else return true
}

/**
 * Основная функция
 * @param from
 * @param to
 * @returns {boolean}
 */
function getColor(from = 1, to = 10) {
    if(!validatedParameters(from, to)) return false

    from = +from
    to = +to

    thereArePrimeNumbers(from, to)

    for (let number = from; number <= to; number++) {
        let colorer = green;

        if (isPrime(number)) {
            if (count % 2 === 0) {
                colorer = yellow;
                count++;
            } else if (count % 3 === 0) {
                colorer = red;
                count = 1;
            } else {
                count++;
            }

            console.log(colorer(number));
        }
    }
}

getColor(from, to)