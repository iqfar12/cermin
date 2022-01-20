import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';

export const getMasterEst = async () => {
  const user = TaskServices.getCurrentUser();
  const dbLocal = TaskServices.getAllData('TM_EST');
  const url = 'http://192.168.100.40:3010/estate';

  let downloadProgress = {
    count: 0,
    total: dbLocal.length,
  };

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + user.ACCESS_TOKEN,
      },
    });
    if (res) {
      if (res.data.data.length > 0) {
        Promise.all(
          res.data.data.map(item => {
            const data = {
              NATIONAL: item.national,
              REGION_CODE: item.regionCode,
              COMP_CODE: item.compCode,
              EST_CODE: item.estCode,
              WERKS: item.werks,
              EST_NAME: item.estName,
              START_VALID: item.startValid,
              END_VALID: item.endValid,
              CITY: item.city,
              INSERT_TIME: item.insertTime,
              UPDATE_TIME: item.updateTime,
            };

            TaskServices.saveData('TM_EST', data);

            downloadProgress = {
              ...downloadProgress,
              count: downloadProgress.count + 1,
            };
          }),
        );
      }
    }
  } catch (error) {
    console.log(error, 'error');
  }

  return downloadProgress;
};
