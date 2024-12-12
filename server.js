// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config({ path: './config/.env' });

const app = express();


// Middleware
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true }
     )
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

const PORT =  3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const User = require('./models/User');

// GET: Retourner tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Éditer un utilisateur par ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
