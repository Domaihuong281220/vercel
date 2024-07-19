const express = require('express');
const app = express();
const port = 3006;
const cors = require('cors');


const TelegramBot = require('node-telegram-bot-api');
const { upload } = require('./multer');


app.use(cors({
  origin: '*'
}));
app.use(express.static('upload'));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post('/send',upload.single('image'), (req, res) => {
  const imagePath = req.file.path.replace(/ /g, "%20");
  res.json({ message: imagePath });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
