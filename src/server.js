const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");
const qs = require("querystring");

const Replicate = require("replicate");
const fetch = require("cross-fetch");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../build")));

const replicate = new Replicate({
  auth: process.env.REACT_APP_REPLICATE_API_TOKEN,
  fetch: fetch,
});

// Verify file existence and size

app.post("/generate-story-image", async (req, res) => {
  try {
    const { personaName } = req.body;

    if (!personaName) {
      throw new Error("Invalid persona name");
    }

    const formData = qs.stringify({
      key: process.env.REACT_APP_STABLEDIFFUSION_API_KEY,
      model: "midjourney",
      prompt: `image of a ${personaName} `,
      negative_prompt:
        "((words)), ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image:
        "https://cdn.midjourney.com/4b57a5e7-8a96-4009-9b49-16a4b729021f/grid_0.png",
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "20",
      seed: null,
      guidance_scale: 7.5,
      scheduler: "UniPCMultistepScheduler",
      webhook: null,
      track_id: null,
    });

    const response = await axios.post(
      "https://stablediffusionapi.com/api/v3/img2img",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, `uploads/${filename}`);

  // Set the appropriate headers for the download
  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-type", "text/vtt");

  // Stream the file to the response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
