
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
    if (category !== 'random') {
      div.classList.add(category + '-frame');
    } else {
      div.classList.add('neutral-frame');
    }
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
  const panel = e.target.closest('.panel');

  if (!panel || panel.classList.contains('filled-panel')) return;

  panelCount++;
  const numberDiv = document.createElement('div');
  numberDiv.className = 'panel-number';
  numberDiv.textContent = panelCount;

  const hidden = document.createElement('div');
  hidden.className = 'hidden-question';
  hidden.textContent = dragged.textContent;

  panel.innerHTML = '';
  panel.appendChild(numberDiv);
  panel.appendChild(hidden);

  panel.classList.add('filled-panel', 'highlighted');
  panel.onclick = () => {
    panel.innerHTML = dragged.textContent;
    panel.classList.remove('highlighted');
    panel.onclick = null;
  };
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
    panel.className = 'panel filled-panel highlighted';

    const numberDiv = document.createElement('div');
    numberDiv.className = 'panel-number';
    numberDiv.textContent = i + 1;

    const hidden = document.createElement('div');
    hidden.className = 'hidden-question';
    hidden.textContent = question;

    panel.appendChild(numberDiv);
    panel.appendChild(hidden);
    panel.onclick = () => {
      panel.innerHTML = question;
      panel.classList.remove('highlighted');
      panel.onclick = null;
    };
    document.getElementById('question-panels').appendChild(panel);
  }
}

function toggleSubmitPanel() {
  const form = document.getElementById('submit-question-form-container');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Add styling for centered number and hidden question
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .hidden-question {
    visibility: hidden;
  }
  .panel-number {
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    margin: auto;
    padding: 20px 0;
  }
  .panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
document.head.appendChild(styleTag);
