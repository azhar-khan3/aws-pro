const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const auth = require('./middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const buckets = {};

// // Create a bucket
// app.post('/buckets', (req, res) => {
//   const { bucketName } = req.body;
//   if (!buckets[bucketName]) {
//     buckets[bucketName] = {};
//     res.status(201).json({ message: 'Bucket created successfully' });
//   } else {
//     res.status(400).json({ message: 'Bucket already exists' });
//   }
// });

// // List buckets
// app.get('/buckets', (req, res) => {
//   res.json(Object.keys(buckets));
// });

// // Create an object in a bucket
// app.post('/buckets/:bucketName/objects/:objectKey', (req, res) => {
//   const { bucketName, objectKey } = req.params;
//   const { data } = req.body;

//   if (!buckets[bucketName]) {
//     res.status(404).json({ message: 'Bucket not found' });
//   } else {
//     buckets[bucketName][objectKey] = data;
//     res.status(201).json({ message: 'Object created successfully' });
//   }
// });

// // Get an object from a bucket
// app.get('/buckets/:bucketName/objects/:objectKey', (req, res) => {
//   const { bucketName, objectKey } = req.params;

//   if (!buckets[bucketName] || !buckets[bucketName][objectKey]) {
//     res.status(404).json({ message: 'Object not found' });
//   } else {
//     res.json(buckets[bucketName][objectKey]);
//   }
// });

// // Delete an object from a bucket
// app.delete('/buckets/:bucketName/objects/:objectKey', (req, res) => {
//   const { bucketName, objectKey } = req.params;

//   if (!buckets[bucketName] || !buckets[bucketName][objectKey]) {
//     res.status(404).json({ message: 'Object not found' });
//   } else {
//     delete buckets[bucketName][objectKey];
//     res.json({ message: 'Object deleted successfully' });
//   }
// });



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Where to store uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Create a route to list buckets
  app.get('/buckets', (req, res) => {
    const buckets = fs.readdirSync('uploads');
    res.json(buckets);
  });
  
  // Create a route to list objects in a bucket
  app.get('/buckets/:bucketName/objects',auth,(req, res) => {
    const { bucketName } = req.params;
    const bucketPath = path.join('uploads', bucketName);
  
    if (fs.existsSync(bucketPath)) {
      const objects = fs.readdirSync(bucketPath);
      res.json(objects);
    } else {
      res.status(404).json({ message: 'Bucket not found' });
    }
  });
  
  // Create a route to put an object (upload a file)
  app.post('/buckets/:bucketName/objects', upload.single('file'), (req, res) => {
    const { bucketName } = req.params;
  
    if (req.file) {
      res.json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ message: 'File upload failed' });
    }
  });


// Create a route to get an object (download a file)
app.get('/buckets/:bucketName/objects/:objectName', (req, res) => {
    const { bucketName, objectName } = req.params;
    const objectPath = path.join('uploads', bucketName, objectName);
  
    if (fs.existsSync(objectPath)) {
      res.download(objectPath, objectName);
    } else {
      res.status(404).json({ message: 'Object not found' });
    }
  });


  // Create a route to delete an object
app.delete('/buckets/:bucketName/objects/:objectName', (req, res) => {
    const { bucketName, objectName } = req.params;
    const objectPath = path.join('uploads', bucketName, objectName);
  
    if (fs.existsSync(objectPath)) {
      fs.unlinkSync(objectPath);
      res.json({ message: 'Object deleted successfully' });
    } else {
      res.status(404).json({ message: 'Object not found' });
    }
  });



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



