const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "mern-ecommerce-products",
    });

    res.status(201).json({
      message: "Upload success",
      url: result.secure_url, 
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};