const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var cors = require('cors');
require('dotenv').config();
const authorize = require('./src/authenticationMiddleware');

const database = require('./src/mongodb');

const app = express();
const PORT = process.env.PORT;

app.use(cors()); //allows all origins


let usersCollection = database.collection('customers');

// Secret key for JWT encoding
const SECRET_KEY = process.env.JWTSECRET;

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.json('Api server reached successfully');
});

// Endpoint to register new users
app.post('/register', async (req, res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const country = req.body.country;
    const gender = req.body.gender;

    if(!email || !password || !name || !country || !gender || email.length < 1 || password.length < 1 || name.length < 1 || gender.length < 1){
        return res.status(400).json({message: 'All fields are required!'});
    }

    if(password.length < 8){
        return res.status(400).json({message: 'Your password length should be 8 or more characters long!'});
    }

    try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already taken!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ email, password: hashedPassword, name, country, gender });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to authenticate users and generate access token
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await usersCollection.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1hr' });
        res.status(200).json({ access_token: accessToken });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Authorization middleware to check access token


// Endpoint to update user records
app.put('/update', authorize, async (req, res) => {
  const { email } = req.user;
  const newName = req.body.name;
  const newGender = req.body.gender;
  try {
    await usersCollection.updateOne({ email }, { $set: { name: newName, gender: newGender } });
    res.status(200).json({ message: 'User record updated successfully' });
  } catch (error) {
    console.error('Error updating user record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});