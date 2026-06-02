import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';

import connectDB from './config/db.js';
dotenv.config();
import noteRoutes from "./routes/noteRoutes.js";


const app = express();
const PORT = process.env.PORT || 5000;
await connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.get('/',(req,res)=>{
    res.status(200).send("THE NOTE APPLICATION")
})


app.use('/api/notes',noteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});