import fs from 'react-native-fs';

export const getImagePath = () => {
  const imagePaths = fs.ExternalDirectoryPath + '/Local/Images';
  return imagePaths;
};
