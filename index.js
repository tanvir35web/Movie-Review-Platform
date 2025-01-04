const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 5000;
const moviesRouter = require('./routes/movies');

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}));



app.use(express.json());
app.use("/api/movies", moviesRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});