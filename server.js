const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Use disk-mounted path for SQLite database
const dbPath = path.join(dataDir, 'votes.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS votes (option TEXT)");
});

app.post('/vote', (req, res) => {
  const option = req.body.option;
  if (option === 'guilty' || option === 'notGuilty') {
    db.run("INSERT INTO votes (option) VALUES (?)", [option], (err) => {
      if (err) return res.status(500).send("Error saving vote");
      res.sendStatus(200);
    });
  } else {
    res.status(400).send("Invalid vote option");
  }
});

app.get('/results', (req, res) => {
  db.all("SELECT option, COUNT(*) as count FROM votes GROUP BY option", (err, rows) => {
    if (err) return res.status(500).send("Error retrieving results");
    const results = { guilty: 0, notGuilty: 0 };
    rows.forEach(row => {
      results[row.option] = row.count;
    });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
