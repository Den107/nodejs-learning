const fs = require('fs')
const {Transform} = require('stream')

const readStream = fs.createReadStream('./access.log', 'utf-8')

/**
 * подготавливаю запись в файл для первого ip
 * @type {WriteStream}
 */
const writeStream1 = fs.createWriteStream('./89.123.1.41_requests.log', {
    flags: 'a',
    encoding: 'utf-8'
})

/**
 * подготавливаю запись в файл для второго ip
 * @type {WriteStream}
 */
const writeStream2 = fs.createWriteStream('./34.48.240.111_requests.log', {
    flags: 'a',
    encoding: 'utf-8'
})

/**
 * трансформирование строки для первого ip
 * @type {module:stream.internal.Transform}
 */
const transformStream1 = new Transform({
    transform(chunk, encoding, callback) {
        const transformedChunk = chunk
            .toString()
            .match(new RegExp('89\\.123\\.1\\.41(.+)$', 'mg'))
            .join('\n')
        callback(null, transformedChunk)
    }
})

/**
 * трансформирование строки для второго ip
 * @type {module:stream.internal.Transform}
 */
const transformStream2 = new Transform({
    transform(chunk, encoding, callback) {
        const transformedChunk = chunk
            .toString()
            .match(new RegExp('34\\.48\\.240\\.111(.+)$', 'mg'))
            .join('\n')
        callback(null, transformedChunk)
    }
})

readStream.pipe(transformStream1).pipe(writeStream1)
console.log('запись 1 завершена')

readStream.pipe(transformStream2).pipe(writeStream2)
console.log('запись 2 завершена')