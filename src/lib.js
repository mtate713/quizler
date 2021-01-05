import fs from 'fs'

// chooseRandom: (items: array, numItems: number) -> array
export const chooseRandom = (items = [], numItems = 0) => {
  if (items.length <= 1) {
    return items;
  }
  let randAmount = numItems;
  if (randAmount == 0) {
    randAmount = 1;
  }
  else if (randAmount > items.length) {
    randAmount = Math.floor(Math.random() * items.length) + 1;
  }

  let randomIndexes = [];
  let x;
  for (var i = 1; i <= randAmount; i++) {
    x = Math.floor(Math.random() * items.length);
    if (randomIndexes.length == 0){
      randomIndexes.push(x);
    }
    else if (randomIndexes.includes(x) == false) {
      randomIndexes.push(x);
    }
    else {
      while (randomIndexes.includes(x)== true) {
        x = Math.floor(Math.random() * items.length);
      }
      randomIndexes.push(x);
    }
  }
  let result = [];
  for (var y of randomIndexes) {
    result.push(items[y]);
  }
  return result;
}

// createPrompt: (prompt: {numQuestions: number, numChoices: number}) -> [{type: string, name: string, message: string}]
export const createPrompt = (prompt = {numQuestions: 1, numChoices: 2}) => {
  let result = [];
  let questionAmount;
  let choiceAmount;
  if (prompt.hasOwnProperty('numQuestions')) {
    questionAmount = prompt.numQuestions;
  }
  else {
    questionAmount = 1;
  }

  if (prompt.hasOwnProperty('numChoices')) {
    choiceAmount = prompt.numChoices;
  }
  else {
    choiceAmount = 2;
  }

  const questionName = 'question-';
  const questionMessage = 'Enter question '
  const choiceName = '-choice-';
  const choiceMessage = 'Enter answer choice '
  let questionObj;
  let choiceObj;
  for (let i = 0; i < questionAmount; i++){
    questionObj = {type: 'input', name: (questionName + String(i + 1)), message: (questionMessage + String(i + 1))};
    result.push(questionObj);
    for (let j = 0; j < choiceAmount; j++) {
      choiceObj = {type: 'input', name: (questionName + String(i + 1) + choiceName + String(j + 1)), message: (choiceMessage + String(j + 1) + ' for question '+ String(i + 1))};
      result.push(choiceObj);
    }

  }

  return result;
  
}

export const createQuestions = (questionList = {}) => {
  let result = [];
  let x;
  let questionObj;
  for (x in questionList) {
    if (x.search("choice") == -1) {
      questionObj = {type: 'list', name: x, message: questionList[x], choices: []};
      result.push(questionObj);
    }
    else{
      result[parseInt(x.charAt(9)) - 1].choices.push(questionList[x]);
    }
  }
  return result;
}

export const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  })

export const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, err =>
      err ? reject(err) : resolve('File saved successfully')
    )
  })
