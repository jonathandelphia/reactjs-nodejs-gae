import React, { useState } from "react";
import axios from "axios";

const CreateImage = () => {
  const [personaName, setPersonaName] = useState("");
  const [imageData, setImageData] = useState(null);

  const generateStoryImage = async () => {
    try {
      const response = await axios.post("/generate-story-image", {
        personaName,
      });
      console.log("Image created successfully:", response.data);
      setImageData(response.data.output[0]);
    } catch (error) {
      console.error("Error generating story image:", error);
      // Handle the error as needed
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    generateStoryImage();
  };

  const handleInputChange = (event) => {
    setPersonaName(event.target.value);
  };

  return (
    <div>
      <h1>Create Image</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Text:
          <input type="text" value={personaName} onChange={handleInputChange} />
        </label>
        <button type="submit">Generate Image</button>
      </form>
      {imageData && (
        <div>
          <h2>Generated Image</h2>
          <img src={imageData} alt="Generated" />
        </div>
      )}
    </div>
  );
};

export default CreateImage;
