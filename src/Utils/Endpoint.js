const baseURl = 'https://faces.infinitec.id';
// const baseURl = 'http://192.168.1.14:3000';

export const Endpoint = {
  Register: baseURl + '/faces/train/binary',
  Recognize: baseURl + '/faces/recognize',
  GetDataset: baseURl + '/faces',
  Validate: baseURl + '/faces/detect',
};
