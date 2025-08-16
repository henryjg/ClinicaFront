import QRCode from 'qrcode';
import { ref } from 'vue';


export function generarQR() {
const TextoqrCode = ref("");

const generateQRCode = async (text: string) => {
        try {
        const url = await QRCode.toDataURL(text, {
            width: 90,  
            scale: 3,
            margin: 1,
            errorCorrectionLevel: 'Q'
        });
        TextoqrCode .value = url;
        } catch (err) {
        console.error(err);
        }
    };
return{
    generateQRCode
}

}