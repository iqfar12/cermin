import RNFS from 'react-native-fs';
import { useEffect } from 'react';

export const ImageToBase64 = async (path) => {
    const res = await RNFS.readFile(path, 'base64')   
    return res
}