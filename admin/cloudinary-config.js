// Cloudinary Configuration
// Replace these with your actual Cloudinary credentials

/* 
IMPORTANT: Upload Preset Setup
1. Go to Cloudinary Dashboard → Settings → Upload
2. Create a new Upload Preset or edit existing one
3. Set "Signing Mode" to "Unsigned"
4. Configure allowed formats, file size limits, folder settings
5. Save the preset and use its name below
*/

const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'df2wdjidc', // Replace with your Cloudinary cloud name
    UPLOAD_PRESET: 'images', // Must be configured as UNSIGNED in Cloudinary dashboard
    
    // Optional: API Key (for advanced features)
    API_KEY: '225391946375934',
    
    // Upload settings
    FOLDER: 'sketchup-gallery',
    MAX_FILE_SIZE: 10000000, // 10MB
    ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    
    // Transformation settings
    EAGER_TRANSFORMATIONS: [
        { width: 400, height: 400, crop: 'fill', quality: 'auto' },
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
    ]
};

// Export for use in other files
window.CLOUDINARY_CONFIG = CLOUDINARY_CONFIG;
