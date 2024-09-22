const express = require('express');
const app = express();
const atob = require('atob'); // Decoding Base64 strings
const mime = require('mime-types'); // To detect MIME types
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Helper to decode Base64 string and get file details
function handleFile(base64Str) {
  if (!base64Str) {
    return { file_valid: false };
  }

  try {
    const buffer = Buffer.from(base64Str, 'base64');
    const mimeType = mime.lookup(buffer);
    const fileSizeKb = Math.ceil(buffer.length / 1024); // Convert size to KB

    return {
      file_valid: true,
      file_mime_type: mimeType,
      file_size_kb: fileSizeKb
    };
  } catch (error) {
    return { file_valid: false };
  }
}

// POST route: /bfhl
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;
  const userId = 'Suyashsoni_12032002'; // Hardcoded user_id
  const email = 'ss9333@srmist.edu.in'; // Hardcoded email
  const rollNumber = 'RA2111003030301'; // Hardcoded roll number

  // Input validation
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid data format.' });
  }

  // Separate numbers and alphabets from data array
  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => isNaN(item) && /^[A-Za-z]+$/.test(item));

  // Find the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter(item => /^[a-z]+$/.test(item));
  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
    ? [lowercaseAlphabets.sort().pop()] // Get the highest alphabet
    : [];

  // Handle file if provided
  const { file_valid, file_mime_type, file_size_kb } = handleFile(file_b64);

  // Build the response
  const response = {
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid,
    file_mime_type,
    file_size_kb
  };

  // Send response
  res.json(response);
});

// GET route: /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
