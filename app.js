const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Hardcoded user information (in a real application, this would come from a database)
const USER_ID = "Suyash_Soni_12032002";
const EMAIL = "ss9333@srmist.edu.in";
const ROLL_NUMBER = "RA2111003030301";

app.get('/api/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.post('/api/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        if (!Array.isArray(data)) {
            throw new Error('Invalid input: data should be an array');
        }

        const numbers = data.filter(item => /^\d+$/.test(item));
        const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
        const highest_lowercase_alphabet = [alphabets.filter(char => /^[a-z]$/.test(char)).sort().pop()].filter(Boolean);

        let file_valid = false;
        let file_mime_type = null;
        let file_size_kb = null;

        if (file_b64) {
            try {
                const buffer = Buffer.from(file_b64, 'base64');
                file_valid = true;
                file_size_kb = (buffer.length / 1024).toFixed(2);
                
                // Basic MIME type detection (this is a simplified version)
                if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
                    file_mime_type = 'image/jpeg';
                } else if (buffer[0] === 0x89 && buffer[1] === 0x50) {
                    file_mime_type = 'image/png';
                } else if (buffer[0] === 0x25 && buffer[1] === 0x50) {
                    file_mime_type = 'application/pdf';
                } else {
                    file_mime_type = 'application/octet-stream';
                }
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }

        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet,
            file_valid,
            file_mime_type,
            file_size_kb
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(400).json({ is_success: false, error: error.message });
    }
});

module.exports = app;