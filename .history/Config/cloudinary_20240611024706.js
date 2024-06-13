import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv"
dotenv.config()
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: "dhxhekwov", 
        api_key: process.env.API_KEY, 
        api_secret: process.env.SECRET_KEY // Click 'View Credentials' below to copy your API secret
    });
    
       
})();