const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const cors = require('cors') ; 

const app = express();
const port = 5008;

app.use(cors()) ;

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('uploads'));

app.get('/', (req, res) => {
    res.send("Hi, kindly fuck off "); 
}) ; 
// POST route to process images
app.post('/process-image', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No image uploaded.');
    }
  
    const transformation = req.body.transformation;
    const brightness = parseInt(req.body.brightness) || 100;
    const contrast = parseInt(req.body.contrast) || 100;
    const text = req.body.text || '';
    const crop = req.body.crop ? JSON.parse(req.body.crop) : null;
    const imagePath = req.file.path;
    const processedFilename = `processed-${Date.now()}.jpg`;
    const outputImagePath = path.join('uploads', processedFilename);
  
    let sharpInstance = sharp(imagePath);
  
    // Apply transformations
    switch (transformation) {
      case "grayscale":
        sharpInstance = sharpInstance.grayscale();
        break;
      case "rotate":
        sharpInstance = sharpInstance.rotate(90);
        break;
      case "resize":
        sharpInstance = sharpInstance.resize(300, 300);
        break;
      case "brightness":
        sharpInstance = sharpInstance.modulate({ brightness: brightness / 100, contrast: contrast / 100 });
        break;
      case "sepia":
        sharpInstance = sharpInstance.tint({ r: 112, g: 66, b: 20 });
        break;
      case "blur":
        sharpInstance = sharpInstance.blur(5);
        break;
      case "sharpen":
        sharpInstance = sharpInstance.sharpen();
        break;
      case "watermark":
        sharpInstance = sharpInstance.composite([
          {
            input: Buffer.from(`<svg><text x="10" y="50" font-size="20">${text}</text></svg>`),
            gravity: "southeast",
          },
        ]);
        break;
      case "crop":
        if (crop) {
          sharpInstance = sharpInstance.extract({
            left: parseInt(crop.x),
            top: parseInt(crop.y),
            width: parseInt(crop.width),
            height: parseInt(crop.height),
          });
        }
        break;
      default:
        return res.status(400).send("Invalid transformation type.");
    }
  
    sharpInstance.toFile(outputImagePath, (err) => {
      if (err) {
        return res.status(500).send("Error processing image.");
      }
  
      res.json({
        success: true,
        imageUrl: processedFilename,
      });
  
      fs.unlinkSync(imagePath); // Remove original file
    });
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
