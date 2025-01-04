const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 5000;
const moviesRouter = require('./routes/movies');
const upload = require('./multerConfig');
const { imageUpload } = require('./services/imageUpload');


const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function handleUpload(req, res) {
    try {
        const imageforBlog = await imageUpload(req);

        console.log('File:', req.file);
        console.log('Form data:', req.body);
        console.log('Image form-data:', imageforBlog);
        res.send('File uploaded successfully!');
    } catch (error) {
        res.status(500).send('Error uploading image');
    }
}

app.post('/upload', upload.single('photo'), handleUpload);



app.use("/api/movies", moviesRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});