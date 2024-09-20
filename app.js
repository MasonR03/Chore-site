const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 1025;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Data Stores
let roommates = ['Mason', 'Will', 'Elliott', 'Maksim', 'Zammit'];

// Standard Chores
let chores = [
  { id: 1, name: 'Vacuum the living room', assignedTo: 'Mason', completed: false },
  { id: 2, name: 'Wash the dishes', assignedTo: 'Will', completed: false },
  { id: 3, name: 'Clean the bathroom', assignedTo: 'Elliott', completed: false },
  { id: 4, name: 'Take out the trash', assignedTo: 'Maksim', completed: false },
  { id: 5, name: 'Laundry', assignedTo: 'Zammit', completed: false },
];

// Dishwasher Chore with completion history
let dishwasherChore = {
  id: 6,
  name: 'Dishwasher Duty',
  assignedTo: 'Mason',
  completed: false,
  history: [] // Array to store completion records
};

// Route to display the homepage
app.get('/', (req, res) => {
  // Get the current date and time
  const currentDateTime = new Date().toLocaleString();

  res.render('index', { chores, dishwasherChore, roommates, currentDateTime });
});

// Route to assign standard chores
app.post('/assign', (req, res) => {
  const { choreId, assignedTo } = req.body;
  const chore = chores.find((c) => c.id == choreId);
  if (chore) {
    chore.assignedTo = assignedTo;
  }
  res.redirect('/');
});

// Route to toggle standard chores
app.post('/toggle', (req, res) => {
  const { choreId } = req.body;
  const chore = chores.find((c) => c.id == choreId);
  if (chore) {
    chore.completed = !chore.completed;
  }
  res.redirect('/');
});

// Route to assign the dishwasher chore
app.post('/assign-dishwasher', (req, res) => {
  const { assignedTo } = req.body;
  dishwasherChore.assignedTo = assignedTo;
  res.redirect('/');
});

// Modified Route to toggle the dishwasher chore and manage history
app.post('/toggle-dishwasher', (req, res) => {
  // Record completion details
  dishwasherChore.history.unshift({
    completedBy: dishwasherChore.assignedTo,
    completedAt: new Date().toLocaleString()
  });

  // Check if history has 5 items, and clear if so
  if (dishwasherChore.history.length >= 5) {
    dishwasherChore.history = [];
  }

  // Reset 'completed' status to false
  dishwasherChore.completed = false;

  // Assign to the next roommate
  const currentAssignee = dishwasherChore.assignedTo;
  const currentIndex = roommates.indexOf(currentAssignee);
  const nextIndex = (currentIndex + 1) % roommates.length;
  dishwasherChore.assignedTo = roommates[nextIndex];

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Chore tracker app is running at http://localhost:${port}`);
});
