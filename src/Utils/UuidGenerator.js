import 'react-native-get-random-values';
import {v4 as uuidV4} from 'uuid';

export const UuidGenerator = () => {
  const id = uuidV4();
  return id;
};
