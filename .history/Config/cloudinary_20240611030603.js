import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: "dhxhekwov",
  api_key: process.env.CLOUAPI_KEY,
  api_secret: process.env.CLOUSECRET_KEY, // Click 'View Credentials' below to copy your API secret
});
export const cloudinaryConfig = cloudinary;
