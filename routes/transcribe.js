const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');

router.post('/', async (req, res) => {
  // console.log('Received request:', req);
  try {
    const busboy = Busboy({ headers: req.headers });

    busboy.on('file', async function(fieldname, file, filename, encoding, mimetype) {
      // console.log(`Received file ${filename}`, fieldname, file, filename, encoding, mimetype);
      const tempFilePath = path.join(os.tmpdir(), "audiofile.webm");
      const writeStream = fs.createWriteStream(tempFilePath);
      file.pipe(writeStream);
      writeStream.on('finish', async () => {
        const fileSize = fs.statSync(tempFilePath).size;
        console.log(`File size: ${fileSize} bytes`);
      
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        // API request to ChatGPT
        const fileStream = fs.createReadStream(tempFilePath);
        const resp = await openai.createTranscription(
          fileStream,
          "whisper-1"
        );
        const chatOutput = resp.data;
        res.json({ message: chatOutput });
        // Delete the temporary file
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error(`Failed to delete temporary file ${tempFilePath}:`, err);
        });
      });
    });

    busboy.on('finish', function() {
      console.log('Finished parsing form!');
    });

    req.pipe(busboy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});


module.exports = router;
