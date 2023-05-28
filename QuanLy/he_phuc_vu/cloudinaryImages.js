const cloudinary = require("cloudinary").v2;

class XL_UPLOAD_CLOUDINARY {
    UPLOAD_CLOUDINARY(name,file) {
        
        cloudinary.config({
            cloud_name: `loivo`,
            api_key: `898462478726388`,
            api_secret:`G7UFWCO7cdFPTRHKygtbLGaRb5A`
        });
        // Gọi phương thức upload -> trả về dạng promise
        
        return cloudinary.uploader.upload(file,{
            public_id: name,
            folder:"/images/",
            format:'png',
            overwrite:true,
            use_filename:true,
            unique_filename:false,
            invalidate:true,
            keep_original:true 
        });
        
    }

}

var imgUpload = new XL_UPLOAD_CLOUDINARY();
module.exports = imgUpload;
