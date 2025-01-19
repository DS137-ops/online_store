const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./router/auth.router');
const helmet = require('helmet');
const cors = require('cors');
const  expressmongosanitize = require("express-mongo-sanitize");
const xss = require("xss-clean")
const app = express();
app.use(expressmongosanitize())
app.use(xss())
const dotenv = require("dotenv")
dotenv.config()
app.use(helmet());
app.use(cors());
app.use(express.json());
const DB_URI = 'mongodb://localhost:27017/pharma',
Global = "mongodb+srv://feadkaffoura:YcQJ6vJSgdBFwX9b@cluster0.v3b0sud.mongodb.net/store?retryWrites=true&w=majority&appName=Cluster0"
mongoose
    .connect(DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api', authRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
