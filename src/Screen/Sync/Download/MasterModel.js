import fs from 'react-native-fs';
import axios from 'axios';
import * as faceapi from 'face-api.js';


export const getModel = async () => {

    let donwloadCount = {
        count: 0,
        total: 4,
    }



    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    // Use a lookup table to find the index.
    const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }

    const decode = (base64: string): ArrayBuffer => {
        let bufferLength = base64.length * 0.75,
            len = base64.length,
            i,
            p = 0,
            encoded1,
            encoded2,
            encoded3,
            encoded4;

        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }

        const arraybuffer = new ArrayBuffer(bufferLength),
            bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i + 1)];
            encoded3 = lookup[base64.charCodeAt(i + 2)];
            encoded4 = lookup[base64.charCodeAt(i + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return arraybuffer;
    };

    const encode = (arraybuffer: ArrayBuffer): string => {
        let bytes = new Uint8Array(arraybuffer),
            i,
            len = bytes.length,
            base64 = '';

        for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
        }

        if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1) + '=';
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + '==';
        }

        return base64;
    };

    const pathSsd = fs.DocumentDirectoryPath + '/ssd_model';
    const pathFaceLandmarks = fs.DocumentDirectoryPath + '/face_landmark_model';
    const pathFaceRecognition = fs.DocumentDirectoryPath + '/face_recognition_model';
    const pathTiny = fs.DocumentDirectoryPath + '/tiny_model';

    const isSSDExist = await fs.exists(pathSsd);
    const isLandmarkExist = await fs.exists(pathFaceLandmarks);
    const isFaceRecognition = await fs.exists(pathFaceRecognition);
    const isTinyExist = await fs.exists(pathTiny);

    if (isFaceRecognition || isLandmarkExist || isSSDExist || isTinyExist) {
        // await onDownloadDataModel();
        console.log('exist');
        return donwloadCount;
    }

    console.log('download model');
    const urlSsd =
        'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/ssd_mobilenetv1.weights';
    const urlFaceLandmark =
        'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/face_landmark_68_model.weights';
    const urlFaceRecognition =
        'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/face_recognition_model.weights';
    const urlTiny =
        'https://github.com/justadudewhohacks/face-api.js-models/raw/master/uncompressed/tiny_face_detector_model.weights';
    const ssd = await axios.get(urlSsd, { responseType: 'arraybuffer' });
    const base64Ssd = encode(ssd.data);
    await fs
        .writeFile(pathSsd, base64Ssd, 'base64')
        .then(() => {
            console.log('succes write ssd')
            donwloadCount = {
                ...donwloadCount,
                count: donwloadCount.count + 1
            }
        }).catch((error) => {
            console.log(error, 'error')
        })

    const faceLandmark = await axios.get(urlFaceLandmark, { responseType: 'arraybuffer' });
    const base64FaceLandmark = encode(faceLandmark.data)
    await fs
        .writeFile(pathFaceLandmarks, base64FaceLandmark, 'base64')
        .then(() => {
            console.log('succes write face landmark')
            donwloadCount = {
                ...donwloadCount,
                count: donwloadCount.count + 1
            }
        }).catch((error) => {
            console.log(error, 'error')
        })

    const faceRecognition = await axios.get(urlFaceRecognition, { responseType: 'arraybuffer' });
    const base64FaceRecognition = encode(faceRecognition.data);
    await fs
        .writeFile(pathFaceRecognition, base64FaceRecognition, 'base64')
        .then(() => {
            console.log('succes write face recognition')
            donwloadCount = {
                ...donwloadCount,
                count: donwloadCount.count + 1
            }
        }).catch((error) => {
            console.log(error, 'error')
        })

    const tiny = await axios.get(urlTiny, { responseType: 'arraybuffer' });
    const base64Tiny = encode(tiny.data);
    await fs
        .writeFile(pathTiny, base64Tiny, 'base64')
        .then(() => {
            console.log('succes write Tiny Ssd')
            donwloadCount = {
                ...donwloadCount,
                count: donwloadCount.count + 1
            }
        }).catch((error) => {
            console.log(error, 'error')
        })

    return donwloadCount
}