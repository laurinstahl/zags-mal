const express = require('express');
const chatRouter = require('./routes/chat');
const transcribeRouter = require('./routes/transcribe');
const cors = require('cors');
const path = require('path'); 

require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

app.use('/api/chat', chatRouter);
app.use('/api/transcribe', transcribeRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'app/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/app/build/index.html'));
});

const PORT = process.env.PORT || 8123; // use the port defined in environment variable or 5000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

