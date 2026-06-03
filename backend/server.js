import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import noteRoutes from "./routes/noteRoutes.js";
import connectDB from './config/db.js';
dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(rateLimiter);
app.get('/',(req,res)=>{
    res.status(200).send("THE NOTE APPLICATION")
})


app.use('/api/notes',noteRoutes);

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((error)=>{
    console.error("Failed to connect to the database", error);
    process.exit(1);
});