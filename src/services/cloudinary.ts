import imageCompression from "browser-image-compression";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/drsh8bkaf/upload";
const CLOUDINARY_UPLOAD_PRESET = "BedAura";
import axios from "axios";

const uploadToCloudinary = async (file: File) => {
  const options = {
    maxSizeMB: 2, 
    maxWidthOrHeight: 1080, 
    useWebWorker: true,
  };

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return null;
    }
  };

  export default uploadToCloudinary;

