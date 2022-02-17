import * as fs from 'expo-file-system';
import * as faceapi from 'face-api.js';
import {decodeJpeg} from '@tensorflow/tfjs-react-native';
import '../../platform';

export const RecognitionOffline = async image => {
  await faceapi.tf.ready();
  const userJsonPath = fs.documentDirectory + 'User.json';
  console.log(userJsonPath, 'ss');
  const jsonString = await fs.readAsStringAsync(userJsonPath);
  console.log(jsonString);
  const userData = JSON.parse(jsonString);
  const img = faceapi.tf.util.encodeString(image, 'base64').buffer;
  const raw = new Uint8Array(img);
  const imageTensor = decodeJpeg(raw);
  const detection = await faceapi
    .detectSingleFace(imageTensor)
    .withFaceLandmarks()
    .withFaceDescriptor();

  console.log(userData);
  const descriptors = userData.map(item =>
    faceapi.LabeledFaceDescriptors.fromJSON(item),
  );

  console.log(descriptors);
  if (detection) {
    const descriptors = userData.map(item =>
      faceapi.LabeledFaceDescriptors.fromJSON(item),
    );
    const faceMatcher = new faceapi.FaceMatcher(descriptors, 0.5);
    const results = faceMatcher.findBestMatch(detection.descriptor);
    return results;
  }
  console.log('No face...');
  return undefined;
};
