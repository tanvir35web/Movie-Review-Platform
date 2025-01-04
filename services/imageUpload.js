const FormData = require('form-data');
const axios = require('axios');

async function imageUpload(req) {
    let imageUrl = null;

    if (req.file) {
        const base64Image = req.file.buffer.toString('base64');
        const formData = new FormData();
        formData.append('image', base64Image);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            imageUrl = response.data.data.url;
        } catch (uploadError) {
            console.error('Error uploading image to ImageBB:', uploadError);
            throw new Error('Error uploading image!');
        }
    }

    return imageUrl;
}

module.exports = { imageUpload };