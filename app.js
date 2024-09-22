const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Helper function to check file validity (Base64)
function isValidBase64(base64String) {
  const regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
  return regex.test(base64String);
}

// POST request to /bfhl
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  // Process input data to separate numbers and alphabets
  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => isNaN(item));
  const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());

  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 
    ? [lowercaseAlphabets.sort().reverse()[0]] : [];

  // File handling
  const fileValid = file_b64 ? isValidBase64(file_b64) : false;
  const fileMimeType = fileValid ? file_b64.split(';')[0].split(':')[1] : null;
  const fileSizeKB = fileValid ? (Buffer.from(file_b64.split(',')[1], 'base64').length / 1024).toFixed(2) : null;

  res.json({
    is_success: true,
    user_id: "Suyash_Soni_12032002",  // Replace with your logic for user ID
    email: "ss9333@srmist.edu.in",         // Replace with user email
    roll_number: "RA2111003030301",        // Replace with roll number
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

// GET request to /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
