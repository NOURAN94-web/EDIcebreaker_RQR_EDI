
let questionBank = {};
let panelCount = 0;

function loadCategory() {
  const category = document.getElementById('category-select').value;
  const questionList = document.getElementById('question-list');
  questionList.innerHTML = '';

  let questions = [];

  if (category === 'random') {
    const allCategories = Object.keys(questionBank);
    allCategories.forEach(cat => questions.push(...questionBank[cat]));
  } else {
    questions = questionBank[category] || [];
  }

  questions.forEach((question, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.textContent = question;
    div.draggable = true;
    div.id = 'q-' + category + '-' + i;
    div.ondragstart = dragStart;
    questionList.appendChild(div);
  });
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const dragged = document.getElementById(id);
  e.target.innerHTML = dragged.textContent;
  e.target.classList.add('filled-panel');
  panelCount++;
  e.target.setAttribute('data-panel-id', panelCount);
  e.target.innerHTML = '<strong>' + panelCount + '</strong><br>' + dragged.textContent;
}

function addPanel() {
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.ondragover = allowDrop;
  panel.ondrop = drop;
  document.getElementById('question-panels').appendChild(panel);
}

function resetPanels() {
  document.getElementById('question-panels').innerHTML = '';
  panelCount = 0;
}

function generateRandomPanels(count) {
  resetPanels();
  let randomQuestions = [];

  const allCategories = Object.keys(questionBank);
  allCategories.forEach(cat => randomQuestions.push(...questionBank[cat]));

  for (let i = 0; i < count; i++) {
    const question = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
    const panel = document.createElement('div');
    panel.className = 'panel filled-panel';
    panel.innerHTML = '<strong>' + (i + 1) + '</strong><br>' + question;
    document.getElementById('question-panels').appendChild(panel);
  }
}
