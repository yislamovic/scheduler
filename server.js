const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from React build (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Mock data
let days = [
  {
    id: 1,
    name: "Monday",
    appointments: [1, 2, 3, 4, 5],
    interviewers: [1, 2],
    spots: 2
  },
  {
    id: 2,
    name: "Tuesday",
    appointments: [6, 7, 8, 9, 10],
    interviewers: [3, 4],
    spots: 1
  },
  {
    id: 3,
    name: "Wednesday",
    appointments: [11, 12, 13, 14, 15],
    interviewers: [1, 3, 5],
    spots: 4
  },
  {
    id: 4,
    name: "Thursday",
    appointments: [16, 17, 18, 19, 20],
    interviewers: [2, 5],
    spots: 3
  },
  {
    id: 5,
    name: "Friday",
    appointments: [21, 22, 23, 24, 25],
    interviewers: [1, 4, 5],
    spots: 2
  }
];

let appointments = {
  "1": { id: 1, time: "12pm", interview: null },
  "2": { id: 2, time: "1pm", interview: null },
  "3": { id: 3, time: "2pm", interview: { student: "John Doe", interviewer: 1 } },
  "4": { id: 4, time: "3pm", interview: null },
  "5": { id: 5, time: "4pm", interview: null },
  "6": { id: 6, time: "12pm", interview: null },
  "7": { id: 7, time: "1pm", interview: { student: "Jane Smith", interviewer: 3 } },
  "8": { id: 8, time: "2pm", interview: null },
  "9": { id: 9, time: "3pm", interview: null },
  "10": { id: 10, time: "4pm", interview: null },
  "11": { id: 11, time: "12pm", interview: null },
  "12": { id: 12, time: "1pm", interview: null },
  "13": { id: 13, time: "2pm", interview: null },
  "14": { id: 14, time: "3pm", interview: null },
  "15": { id: 15, time: "4pm", interview: null },
  "16": { id: 16, time: "12pm", interview: null },
  "17": { id: 17, time: "1pm", interview: null },
  "18": { id: 18, time: "2pm", interview: null },
  "19": { id: 19, time: "3pm", interview: null },
  "20": { id: 20, time: "4pm", interview: null },
  "21": { id: 21, time: "12pm", interview: null },
  "22": { id: 22, time: "1pm", interview: null },
  "23": { id: 23, time: "2pm", interview: null },
  "24": { id: 24, time: "3pm", interview: null },
  "25": { id: 25, time: "4pm", interview: null }
};

const interviewers = {
  "1": {
    id: 1,
    name: "Sylvia Palmer",
    avatar: "https://i.imgur.com/LpaY82x.png"
  },
  "2": {
    id: 2,  
    name: "Tori Malcolm",
    avatar: "https://i.imgur.com/Nmx0Qxo.png"
  },
  "3": {
    id: 3,
    name: "Mildred Nazir", 
    avatar: "https://i.imgur.com/T2WwVfS.png"
  },
  "4": {
    id: 4,
    name: "Cohana Roy",
    avatar: "https://i.imgur.com/FK8V841.jpg"
  },
  "5": {
    id: 5,
    name: "Sven Jones",
    avatar: "https://i.imgur.com/twYrpay.jpg"
  }
};

// Helper function to update spots
function updateSpots() {
  days.forEach(day => {
    let spots = 0;
    day.appointments.forEach(appointmentId => {
      if (!appointments[appointmentId].interview) {
        spots++;
      }
    });
    day.spots = spots;
  });
}

// API Routes
app.get('/api/days', (req, res) => {
  res.json(days);
});

app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.get('/api/interviewers', (req, res) => {
  res.json(interviewers);
});

app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { interview } = req.body;
  
  if (appointments[id]) {
    appointments[id].interview = interview;
    updateSpots();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;

  if (appointments[id]) {
    appointments[id].interview = null;
    updateSpots();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Serve React app for all other routes (in production)
if (process.env.NODE_ENV === 'production') {
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});