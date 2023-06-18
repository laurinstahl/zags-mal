const express = require('express');
const chatRouter = require('./routes/chat');
const transcribeRouter = require('./routes/transcribe');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

app.use('/api/chat', chatRouter);
app.use('/api/transcribe', transcribeRouter);


const PORT = process.env.PORT || 8123; // use the port defined in environment variable or 5000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
