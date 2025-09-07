const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
require('dotenv').config();

// 🔑 Login Route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // 🛑 Validation check
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // 🔎 Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 🔑 Compare password (assuming you added comparePassword method in User model)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 🎟 Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ✅ Success Response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 👥 Get all users (Protected route suggested)
router.get('/list', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // exclude password
        res.status(200).json(users);
    } catch (err) {
        console.error('❌ Fetch users error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
