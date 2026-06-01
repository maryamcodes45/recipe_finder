import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';

dotenv.config();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipe_finder';

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://localhost:5001', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// DB Connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB database. 🚀');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        console.log('Using local JSON file database fallback (db.json) for read/write queries. ❌');
    });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Pakistani Recipe Finder Full-Stack Backend API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running in dev mode on http://localhost:${PORT}`);
    console.log(`Using Database URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`);
});