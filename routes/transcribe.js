const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const Busboy = require('busboy');

router.post('/', async (req, res) => {
  try {
    const busboy = Busboy({ headers: req.headers });

    busboy.on('file', async function(fieldname, file, filename, encoding, mimetype) {
      console.log(`Received file ${filename}`);
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      // API request to ChatGPT
      const resp = await openai.createTranscription(
        file,
        "whisper-1"
      );
      const chatOutput = resp.data;
      res.json({ message: chatOutput });
    });

    busboy.on('finish', function() {
      console.log('Finished parsing form!');
    });

    // req.pipe(busboy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});


module.exports = router;
