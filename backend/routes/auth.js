import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { fallbackUsers } from '../models/dbFallback.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_recipe_finder_token_key_123';

// Generate JWT Token
const generateToken = (user) => {
    const userId = typeof user._id === 'object' ? user._id.toString() : (user._id || user.id);
    return jwt.sign({ id: userId, email: user.email, role: user.role, name: user.name },
        JWT_SECRET, { expiresIn: '30d' }
    );
};

// SIGNUP
router.post('/signup', async(req, res) => {
    const { name, email, password } = req.body;
    try {
        let userExists;
        if (mongoose.connection.readyState === 1) {
            userExists = await User.findOne({ email: email.toLowerCase() });
        } else {
            userExists = await fallbackUsers.findOne({ email: email.toLowerCase() });
        }

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Auto-assign admin if email matches admin@recipe.com or contains 'admin' (for simple demo testing)
        const role = (email.toLowerCase() === 'admin@recipe.com' || email.toLowerCase().includes('admin_demo')) ? 'admin' : 'user';

        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.create({
                name,
                email: email.toLowerCase(),
                password,
                role,
                favorites: []
            });
        } else {
            user = await fallbackUsers.create({
                name,
                email: email.toLowerCase(),
                password,
                role,
                favorites: []
            });
        }

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                favorites: user.favorites || []
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// LOGIN
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findOne({ email: email.toLowerCase() });
        } else {
            user = await fallbackUsers.findOne({ email: email.toLowerCase() });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        let isMatch = false;
        if (mongoose.connection.readyState === 1) {
            isMatch = await user.comparePassword(password);
        } else {
            isMatch = bcrypt.compareSync(password, user.password);
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                favorites: user.favorites || []
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// GET USER FAVORITES
router.get('/favorites', async(req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findById(decoded.id);
        } else {
            user = await fallbackUsers.findById(decoded.id);
        }
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.favorites || []);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// ADD FAVORITE
router.post('/favorites/add', async(req, res) => {
    const { recipeId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        let favorites;
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (!user.favorites.includes(recipeId)) {
                user.favorites.push(recipeId);
                await user.save();
            }
            favorites = user.favorites;
        } else {
            favorites = await fallbackUsers.addFavorite(decoded.id, recipeId);
            if (!favorites) return res.status(404).json({ message: 'User not found' });
        }
        res.json(favorites);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// REMOVE FAVORITE
router.post('/favorites/remove', async(req, res) => {
    const { recipeId } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        let favorites;
        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            user.favorites = user.favorites.filter((id) => id !== recipeId);
            await user.save();
            favorites = user.favorites;
        } else {
            favorites = await fallbackUsers.removeFavorite(decoded.id, recipeId);
            if (!favorites) return res.status(404).json({ message: 'User not found' });
        }
        res.json(favorites);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;