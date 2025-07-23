async function vote(option) {
  await fetch('/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option })
  });
  updateDisplay();
}

async function updateDisplay() {
  const res = await fetch('/results');
  const data = await res.json();
  document.getElementById('guiltyCount').textContent = data.guilty || 0;
  document.getElementById('notGuiltyCount').textContent = data.notGuilty || 0;
}

window.onload = updateDisplay;
