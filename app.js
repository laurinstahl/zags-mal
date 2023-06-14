const express = require('express');
const mongoose = require('mongoose');
const itemsRouter = require('./routes/items');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost/reusable-project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected');

}).catch(err => {
  console.error('Database connection failed', err);
});

app.use('/api/items', itemsRouter);

const PORT = process.env.PORT || 8123; // use the port defined in environment variable or 5000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
