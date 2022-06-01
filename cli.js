const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const inquirer = require('inquirer')
const { Transform } = require('stream')


async function getFile(directory) {
    const question1 = await inquirer.prompt([
        {
            name: 'fileName',
            type: 'list',
            message: `You are in ${directory} directory, choose file`,
            choices: fs.readdirSync(directory),
        },
    ]);

    const newFilePath = path.join(directory, question1.fileName)

    if (!fs.lstatSync(newFilePath).isFile()){
        return getFile(newFilePath)
    }

    const question2 = await inquirer.prompt([
        {
            name: 'search',
            type: 'input',
            message: 'Enter search string',
        },
    ]);

    const regExp = new RegExp(`^.*${question2.search}.*$`, 'gm')
    const readStream = fs.createReadStream(newFilePath, 'utf-8')

    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformedChunk = chunk
                .toString()
                .match(regExp)
                .join('\n')
            callback(null, transformedChunk)
        }
    })

    if (question2.search) {
        readStream.pipe(transformStream).pipe(process.stdout);
    } else {
        readStream.pipe(process.stdout);
    }
}

const options = yargs.option('d', {
    alias: 'directory',
    describe: 'Path to directory',
    type: 'string',
    default: process.cwd(),
}).argv

getFile(options.directory)