import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
await connectDB();


app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});