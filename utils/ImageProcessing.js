import axios from 'axios';
import RNFS from 'react-native-fs';

const REMOVE_BG_API_KEY = 'DUH27qcYPfQACdpkcWdjrNVH'; // You'll need to replace this with your actual API key

export const removeBackground = async imageUri => {
  try {
    // Read the image file as base64
    const base64Image = await RNFS.readFile(imageUri, 'base64');

    // Make API request to Remove.bg
    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
        'Content-Type': 'application/json',
      },
      data: {
        image_file_b64: base64Image,
        size: 'auto',
        format: 'auto',
        bg_color: '',
      },
      responseType: 'arraybuffer',
    });

    // Convert the response to base64
    const processedImageBase64 = Buffer.from(response.data).toString('base64');

    // Create a temporary file path for the processed image
    const tempFilePath = `${
      RNFS.CachesDirectoryPath
    }/processed_${Date.now()}.png`;

    // Write the processed image to the temporary file
    await RNFS.writeFile(tempFilePath, processedImageBase64, 'base64');

    return {
      success: true,
      uri: `file://${tempFilePath}`,
      base64: processedImageBase64,
    };
  } catch (error) {
    console.error('Background removal error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
