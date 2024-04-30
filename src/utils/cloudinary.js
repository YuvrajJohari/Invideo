import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

//adding cloudinary details
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
  api_key: process.env.CLOUDINARY_APIKEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
 const uploadOnCloudinary= async(localFilePath)=>{
    try{
        if(!localFilePath)  return null
        //uploading on cloudinary
      const response= await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        //file has been uploaded successfully..
        console.log("file has been uploaded successfully....",response.url);
        return response;

    }catch(error){
        //remove the locally saved temporary file as the  upload operation got failed 
        fs.unlinkSync(localFilePath)
        return null;
    }
 }



export {uploadOnCloudinary}


//uploading on cloudinary

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });