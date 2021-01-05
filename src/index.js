import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import vorpal from 'vorpal'
import pkg from 'inquirer';
const {prompt} = pkg;

import {
  readFile,
  writeFile,
  chooseRandom,
  createPrompt,
  createQuestions
} from './lib.js'
import { get } from 'https';

var quizFilePath = path.resolve('.');
quizFilePath += '/quizzes/';

const cli = vorpal()

const askForQuestions = [
  {
    type: 'input',
    name: 'numQuestions',
    message: 'How many questions do you want in your quiz?',
    validate: input => {
      const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/)
      return pass ? true : 'Please enter a valid number!'
    }
  },
  {
    type: 'input',
    name: 'numChoices',
    message: 'How many choices should each question have?',
    validate: input => {
      const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/)
      return pass ? true : 'Please enter a valid number!'
    }
  }
]

// Writes createdQuiz File to "quizzes" folder
const createQuiz = title => {
  prompt(askForQuestions)
    .then(answer => {
      const quiz = createPrompt(answer);
      prompt(quiz)
        .then(createdQuiz => {
          let filePath = quizFilePath + title;
          console.log(filePath);
          writeFile(filePath, JSON.stringify(createdQuiz))
            .then(() => console.log("Wrote file successfully!"))
        })
    })
    .catch(err => console.log('Error creating the quiz.', err))
  }

// Writes output File to "quizzes" folder
const takeQuiz = (title, output) => {
  readFile(title)
    .then(data => JSON.parse(data))
    .then(parsedData => {
      let questions = createQuestions(parsedData)
      prompt(questions)
        .then(answers => {
          let filePath = quizFilePath + output;
          writeFile(filePath, JSON.stringify(answers))
            .then(() => console.log("Wrote file successfully!"))
        })
    })
    .catch(err => console.log('Error taking the quiz.', err))
};

function getRandomQuestions(quiz, n) {
  return new Promise((resolve) => {
    setTimeout(() =>{
      readFile(quiz)
      .then(data => JSON.parse(data))
      .then(function(parsedData) {
        let randQuestionsList = [];
        let questions = createQuestions(parsedData)
        let randQuestions = chooseRandom(questions, n)
        for (var question of randQuestions){
            randQuestionsList.push(question)
        }
         resolve(randQuestionsList); 
      })
      .catch(err => console.log('Error loading quiz file.', err))
    }, Math.floor(Math.random() * 1000))
  
  });
}

// Writes output File to "quizzes" folder
const takeRandomQuiz = (quizzes, output, n) => {
  let promises = []
  for (let quiz of quizzes) {
    promises.push(getRandomQuestions(quiz, n))
  }
  console.log(promises);
  Promise.all(promises)
    .then((result) => {
      let randQuiz = []
      for (let list of result) {
        for (let question of list) {  
          randQuiz.push(question)
        }
      }
      console.log(randQuiz)
      prompt(randQuiz)
      .then(answers => {
        let filePath = quizFilePath + output;
        writeFile(filePath, JSON.stringify(answers))
            .then(() => console.log("Wrote file successfully!"))
      })
      .catch(err => console.log('Error taking the quiz.', err))
    })
}



cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    return createQuiz(input.fileName)
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeQuiz(input.fileName, input.outputFile)
  });

cli
  .command(
    'random <outputFile> <fileNames...>',
    'Loads a quiz or' +
      ' multiple quizes and selects a random number of questions from each quiz.' +
      ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    var fileNamesArray = input.fileNames;
    if (fileNamesArray.length == 1) {
      return takeQuiz(fileNamesArray[0], input.outputFile);
    }
    else {
      let x = Math.floor(Math.random() * 100) + 1;
      return takeRandomQuiz(fileNamesArray, input.outputFile, x)
    }

  });

cli.delimiter(cli.chalk['yellow']('quizler>')).show()
