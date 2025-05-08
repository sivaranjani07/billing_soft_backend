
import { Buffer } from "buffer";
import bwipjs from "bwip-js";
import path from "path";
import fs from "fs";


export const barCodeImageGenerator = async (text: string): Promise<Buffer> => {

    try {
        const imagePath = path.join(__dirname, `./${text}.png`);
        const png = await bwipjs.toBuffer({
            bcid: 'code128',
            text,
            scale: 3,
            height: 10,
            includetext: true, // Include the text of the barcode under the image
            textxalign: 'center', // Align the text
        });
        fs.writeFileSync(imagePath, png);
        return png;
    } catch (error) {
        console.error("Error generating barcode image:", error);
        throw error; // Rethrow the error to ensure all paths return a value
    }

}