const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
cors({ origin: "*" });
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateResponse = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (response.data) {
      console.log(prompt);
      return { success: true, data: response.data.choices[0].text }
    } else {
      return { success: false }
    }
  } catch (err) {
    console.log(err);
  }

}

const generateImage = async (prompt) => {
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data.data[0].url;
    if (image_url) {
      return { success: true, url: image_url }
    } else {
      return { success: false }
    }
  } catch (err) {
    console.log(err);
  }

}

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to my openai project" });
})
app.post('/chatgpt', async (req, res) => {
  try {
    console.log("prompt", req.body.prompt);
    const response = await generateResponse(req.body.prompt);
    if (response.success) {
      res.json({ success: true, answer: response.data });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
  }
})

app.post('/genimage', async (req, res) => {
  try {
    const response = await generateImage(req.body.prompt);
    if (response.success) {
      res.json({ success: true, url: response.url });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
  }
})

app.listen(3000, () => {
  console.log("application started successfully");
});

