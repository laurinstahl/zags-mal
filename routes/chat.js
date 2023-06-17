const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

let conversationHistory = [
  {"role": "system", "content": "Du bist ein Deutschlehrer. Du verstehst kein Englisch und antwortest nur deutschen Nachrichten. Versuche relativ kurz und knapp zu antworten (maximal 3 Sätze) und versuche immer mit Fragen zu enden. Du sprichst mit einem Deutschanfänger"}
];

router.post('/', async (req, res) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chatInput = req.body;

    // Add the user's message to the conversation history
    conversationHistory.push({role: "user", content: chatInput.message});

    // API request to ChatGPT
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversationHistory,
    });

    // console.log(completion.data);

    const chatOutput = completion.data.choices[0].message.content.trim();
    res.json({ message: chatOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

module.exports = router;
