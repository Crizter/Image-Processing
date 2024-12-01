import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [transformation, setTransformation] = useState("grayscale");
  const [brightness, setBrightness] = useState(100); // Default brightness
  const [contrast, setContrast] = useState(100); // Default contrast
  const [text, setText] = useState(""); // For watermark
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 300, height: 300 }); // Cropping dimensions
  const [transformedImage, setTransformedImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleTransformImage = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("transformation", transformation);
    formData.append("brightness", brightness);
    formData.append("contrast", contrast);
    formData.append("text", text);
    formData.append("crop", JSON.stringify(crop));

    try {
      const response = await axios.post("http://localhost:5008/process-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setTransformedImage(response.data.imageUrl);
        setMessage("Image processed successfully!");
      } else {
        setMessage("Error processing image.");
      }
    } catch (error) {
      setMessage("Error processing image.");
    }
  };

  return (
    <div className="App">
      <h1>Image Processing Web App</h1>
      <input type="file" onChange={handleImageUpload} />
      <div>
        <label>Select Transformation:</label>
        <select value={transformation} onChange={(e) => setTransformation(e.target.value)}>
          <option value="grayscale">Grayscale</option>
          <option value="rotate">Rotate 90°</option>
          <option value="resize">Resize (300x300)</option>
          <option value="brightness">Brightness/Contrast</option>
          <option value="sepia">Sepia Filter</option>
          <option value="blur">Blur Filter</option>
          <option value="sharpen">Sharpen Filter</option>
          <option value="watermark">Add Text Watermark</option>
          <option value="crop">Crop</option>
        </select>
      </div>

      {transformation === "brightness" && (
        <div>
          <label>Brightness:</label>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
          />
          <label>Contrast:</label>
          <input
            type="range"
            min="50"
            max="150"
            value={contrast}
            onChange={(e) => setContrast(e.target.value)}
          />
        </div>
      )}

      {transformation === "watermark" && (
        <div>
          <label>Watermark Text:</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      )}

      {transformation === "crop" && (
        <div>
          <label>Crop Dimensions:</label>
          <input
            type="number"
            placeholder="x"
            value={crop.x}
            onChange={(e) => setCrop({ ...crop, x: e.target.value })}
          />
          <input
            type="number"
            placeholder="y"
            value={crop.y}
            onChange={(e) => setCrop({ ...crop, y: e.target.value })}
          />
          <input
            type="number"
            placeholder="width"
            value={crop.width}
            onChange={(e) => setCrop({ ...crop, width: e.target.value })}
          />
          <input
            type="number"
            placeholder="height"
            value={crop.height}
            onChange={(e) => setCrop({ ...crop, height: e.target.value })}
          />
        </div>
      )}

      <button onClick={handleTransformImage}>Process Image</button>

      {message && <p>{message}</p>}

      {transformedImage && (
        <div>
          <h2>Processed Image:</h2>
          <img src={`http://localhost:5008/${transformedImage}`} alt="Processed" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;




{/* <img src={`http://localhost:5008/${transformedImage}`} alt="Processed" /> */}
// 