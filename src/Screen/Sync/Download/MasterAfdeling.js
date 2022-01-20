import axios from 'axios';
import TaskServices from '../../../Database/TaskServices';

export const getMasterAfdeling = async () => {
  const user = TaskServices.getCurrentUser();
  const url = 'http://192.168.100.40:3010/afdeling';
  const dbLocal = TaskServices.getAllData('TM_AFD');

  let downloadProgress = {
    total: dbLocal.length,
    count: 0,
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
            let data = {
              NATIONAL: item.national,
              REGION_CODE: item.regionCode,
              COMP_CODE: item.compCode,
              EST_CODE: item.estCode,
              WERKS: item.werks,
              SUB_BA_CODE: item.subBaCode,
              KEBUN_CODE: item.kebunCode,
              AFD_CODE: item.afdCode,
              AFD_NAME: item.afdName,
              AFD_CODE_GIS: item.afdCodeGis,
              START_VALID: item.startValid,
              END_VALID: item.endValid,
              INSERT_TIME: item.insertTime,
              UPDATE_TIME: item.updateTime,
            };

            TaskServices.saveData('TM_AFD', data);

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
