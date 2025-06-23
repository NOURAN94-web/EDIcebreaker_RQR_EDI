
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
  panelCount++;
  e.target.classList.add('filled-panel');
  e.target.setAttribute('data-panel-id', panelCount);
  e.target.setAttribute('data-question', dragged.textContent);
  e.target.innerHTML = '<strong style="font-size: 24px;">' + panelCount + '</strong>';
  e.target.onclick = function () {
    const question = this.getAttribute('data-question');
    this.innerHTML = question;
    this.style.backgroundColor = '#fefefe';
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
    panel.className = 'panel filled-panel';
    panel.setAttribute('data-question', question);
    panel.innerHTML = '<strong style="font-size: 24px;">' + (i + 1) + '</strong>';
    panel.onclick = function () {
      this.innerHTML = question;
      this.style.backgroundColor = '#fefefe';
    };
    document.getElementById('question-panels').appendChild(panel);
  }
}

// SUBMIT NEW QUESTION LOGIC
let submittedQuestions = JSON.parse(localStorage.getItem('submittedQuestions')) || [];

function toggleSubmitPanel() {
  const form = document.getElementById('submit-question-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function displaySubmittedQuestions() {
  const list = document.getElementById('submitted-questions-list');
  list.innerHTML = '';
  submittedQuestions.forEach(({ question, category, approved }, index) => {
    const li = document.createElement('li');
    li.style.border = '1px solid #ccc';
    li.style.padding = '10px';
    li.style.marginBottom = '10px';
    li.innerHTML = `<strong>Category:</strong> ${category}<br><strong>Question:</strong> ${question}`;
    if (!approved) {
      const delBtn = document.createElement('button');
      delBtn.innerText = '🗑️ Delete';
      delBtn.style.marginLeft = '10px';
      delBtn.onclick = () => {
        submittedQuestions.splice(index, 1);
        localStorage.setItem('submittedQuestions', JSON.stringify(submittedQuestions));
        displaySubmittedQuestions();
      };
      li.appendChild(delBtn);
    }
    list.appendChild(li);
  });
}

function submitQuestionForm(e) {
  e.preventDefault();
  const question = document.getElementById('new-question').value.trim();
  const category = document.getElementById('new-category').value;

  if (!question || !category) {
    alert('Please fill out both the question and category.');
    return;
  }

  submittedQuestions.push({ question, category, approved: false });
  localStorage.setItem('submittedQuestions', JSON.stringify(submittedQuestions));

  alert('Thank you for submitting your question! It will be reviewed by the admin.');
  document.getElementById('submit-question-form').reset();
  displaySubmittedQuestions();
}

function downloadSubmissions() {
  if (submittedQuestions.length === 0) {
    alert('No questions submitted yet.');
    return;
  }

  const blob = new Blob([JSON.stringify(submittedQuestions, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'submitted_questions.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importApprovedQuestions() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const approved = JSON.parse(event.target.result);
        approved.forEach(({ question, category }) => {
          if (!questionBank[category]) questionBank[category] = [];
          questionBank[category].push(question);
          submittedQuestions.push({ question, category, approved: true });
        });
        localStorage.setItem('submittedQuestions', JSON.stringify(submittedQuestions));
        alert('Approved questions have been added!');
        displaySubmittedQuestions();
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

window.onload = () => displaySubmittedQuestions();
