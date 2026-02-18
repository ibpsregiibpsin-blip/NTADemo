const questions = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  text:
    i % 3 === 0
      ? 'The de-Broglie wavelength of a neutron in thermal equilibrium with heavy water at temperature T(K) is best represented by:'
      : i % 3 === 1
      ? 'In an electromagnetic wave in free space, if Erms = 6 V/m, then the magnetic field peak value is:'
      : 'A particle performs SHM with angular frequency ω. Which expression correctly gives its total energy? ',
  options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  selected: null,
  visited: false,
  status: 'not-visited',
}));

let current = 0;
let remaining = 3 * 60 * 60;

const els = {
  questionTitle: document.getElementById('questionTitle'),
  questionText: document.getElementById('questionText'),
  options: document.getElementById('options'),
  palette: document.getElementById('palette'),
  countNV: document.getElementById('countNV'),
  countNA: document.getElementById('countNA'),
  countA: document.getElementById('countA'),
  countR: document.getElementById('countR'),
  countAR: document.getElementById('countAR'),
  timer: document.getElementById('timer'),
};

function markVisited(index) {
  const q = questions[index];
  if (!q.visited) {
    q.visited = true;
    q.status = 'not-answered';
  }
}

function classForStatus(status) {
  return (
    {
      'not-visited': 'state-not-visited',
      'not-answered': 'state-not-answered',
      answered: 'state-answered',
      review: 'state-review',
      'answered-review': 'state-answered-review',
    }[status] || 'state-not-visited'
  );
}

function updateStats() {
  const counters = { 'not-visited': 0, 'not-answered': 0, answered: 0, review: 0, 'answered-review': 0 };
  questions.forEach((q) => counters[q.status]++);
  els.countNV.textContent = counters['not-visited'];
  els.countNA.textContent = counters['not-answered'];
  els.countA.textContent = counters.answered;
  els.countR.textContent = counters.review;
  els.countAR.textContent = counters['answered-review'];
}

function renderPalette() {
  els.palette.innerHTML = '';
  questions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.className = `palette-btn ${classForStatus(q.status)} ${idx === current ? 'ring-4 ring-black' : ''}`;
    btn.textContent = String(q.id).padStart(2, '0');
    btn.onclick = () => {
      current = idx;
      markVisited(current);
      render();
    };
    els.palette.appendChild(btn);
  });
}

function renderQuestion() {
  const q = questions[current];
  els.questionTitle.textContent = `Question ${q.id}:`;
  els.questionText.textContent = q.text;
  els.options.innerHTML = '';

  q.options.forEach((opt, i) => {
    const wrap = document.createElement('label');
    wrap.className = 'option-row flex items-center gap-3';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.className = 'w-6 h-6';
    input.checked = q.selected === i;
    input.onchange = () => {
      q.selected = i;
      if (q.status === 'review') q.status = 'answered-review';
      else q.status = 'answered';
      updateStats();
      renderPalette();
    };
    const txt = document.createElement('span');
    txt.textContent = `${i + 1}) ${opt}`;
    wrap.append(input, txt);
    els.options.appendChild(wrap);
  });
}

function goNext() {
  current = Math.min(questions.length - 1, current + 1);
  markVisited(current);
  render();
}

function render() {
  renderQuestion();
  updateStats();
  renderPalette();
}

document.getElementById('clear').onclick = () => {
  const q = questions[current];
  q.selected = null;
  q.status = q.visited ? 'not-answered' : 'not-visited';
  render();
};

document.getElementById('saveNext').onclick = () => {
  const q = questions[current];
  q.status = q.selected === null ? 'not-answered' : 'answered';
  goNext();
};

document.getElementById('saveMark').onclick = () => {
  const q = questions[current];
  q.status = q.selected === null ? 'review' : 'answered-review';
  render();
};

document.getElementById('markNext').onclick = () => {
  const q = questions[current];
  q.status = q.selected === null ? 'review' : 'answered-review';
  goNext();
};

document.getElementById('nextBtn').onclick = goNext;
document.getElementById('backBtn').onclick = () => {
  current = Math.max(0, current - 1);
  markVisited(current);
  render();
};

setInterval(() => {
  remaining = Math.max(0, remaining - 1);
  const hh = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  els.timer.textContent = `${hh}:${mm}:${ss}`;
}, 1000);

markVisited(current);
render();
