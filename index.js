const express = require('express');
const app = express();
const port = 3006;
const cors = require('cors');


const TelegramBot = require('node-telegram-bot-api');
const { upload } = require('./multer');


app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post('/send',upload.single('image'), (req, res) => {
  console.log(req.file);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
