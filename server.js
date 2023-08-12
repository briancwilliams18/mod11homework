const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('develop/public'));

// Route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop', 'public', 'index.html'));
});

// Route for serving notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop', 'public', 'notes.html'));
});

// Route for getting all notes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./develop/db/db.json', 'utf8'));
  res.json(notes);
});

// Route for saving a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = JSON.parse(fs.readFileSync('./develop/db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('./develop/db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

// Route for deleting a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = JSON.parse(fs.readFileSync('./develop/db/db.json', 'utf8'));
  const updatedNotes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync('./develop/db/db.json', JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
