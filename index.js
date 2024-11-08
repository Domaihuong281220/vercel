const express = require('express');
const cors = require('cors');
const { upload } = require('./multer');
const { pool, connectDB } = require('./db');

const app = express();
const port = 3006;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.static('upload'));
app.use(express.json()); // Middleware to parse JSON bodies


// Connect to database
connectDB();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const exerciseData = {
  question: {
    paragraph:
      "The sky is [_input] and the grass is [_input]. You should drag the word <span style='color: red;'>green</span> to the correct blank.",
    blanks: [
      { id: 1, position: "first", correctAnswer: "blue", type: "input" },
      { id: 2, position: "second", correctAnswer: "green", type: "drag" }
    ],
    dragWords: [
      { word: "blue", color: "default", id: 1 },
      { word: "green", color: "red", id: 2 },
      { word: "yellow", color: "default", id: 3 },
      { word: "red", color: "default", id: 4 }
    ]
  }
};

// Route to fetch the exercise data
app.get("/api/exercise", (req, res) => {
  res.json(exerciseData);
});

app.post("/api/submit", (req, res) => {
  console.log("Received answers:", req.body.answers);

  const { answers } = req.body;

  // Check the number of correct answers
  let correctCount = 0;
  answers.forEach((answer, index) => {
    if (answer === exerciseData.question.blanks[index].correctAnswer) {
      correctCount++;
    }
  });

  const isCorrect = correctCount === exerciseData.question.blanks.length;
  const message = isCorrect ? "Correct!" : "Try Again!";

  res.json({ message, correctCount });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World1!' });
});

app.post('/send', upload.single('image'), (req, res) => {
  const imagePath = req.file.path.replace(/ /g, "%20");
  res.json({ message: imagePath });
});

app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM your_table_name');
    client.release(); // Release the client back to the pool
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const client = await pool.connect();
    const insertQuery = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [name, email, password]);
    client.release();

    res.status(201).json(result.rows[0]); // Respond with the created user
  } catch (err) {
    console.error('Error inserting user into the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    client.release(); // Release the client back to the pool
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/message', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM message');
    client.release(); // Release the client back to the pool
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/message', async (req, res) => {
  const { message, image } = req.body;
  console.log(req.body);
  

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const client = await pool.connect();
    const insertQuery = `
      INSERT INTO message (message, image)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await client.query(insertQuery, [message, image]);
    client.release();

    res.status(201).json(result.rows[0]); // Respond with the created message
  } catch (err) {
    console.error('Error inserting message into the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/message/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const deleteQuery = `
      DELETE FROM message
      WHERE id = $1
      RETURNING *;
    `;
    const result = await client.query(deleteQuery, [id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]); // Respond with the deleted message
  } catch (err) {
    console.error('Error deleting message from the database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
