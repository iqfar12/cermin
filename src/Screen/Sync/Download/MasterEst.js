import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';
import { loggingError } from '../../../Utils/ErrorLogging';

export const getMasterEst = async () => {
  const user = TaskServices.getCurrentUser();
  const url =  user.SERVER + '/crm-msa-attendance/estate';
  const dbLocal = TaskServices.getAllData('TM_EST').filter((item) => {
    const location = user.LOCATION.split(',');
    if (user.REFERENCE_LOCATION == 'AFD') {
      return location.map((a) => a.substr(0, 4)).includes(item.WERKS);
    } else if (user.REFERENCE_LOCATION == 'BA') {
      return location.includes(item.WERKS)
    } else {
      return location.includes(item.COMP_CODE)
    }
  })

  let downloadProgress = {
    count: 0,
    total: user.LAST_SYNC !== null ? dbLocal.length : 0,
  };

  try {
    let params = new URLSearchParams();
    if (user.LAST_SYNC !== null) {
      params.append('sync', true);
    }
    const res = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + user.ACCESS_TOKEN,
      },
      params: params
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
    downloadProgress = {
      ...downloadProgress,
      total: downloadProgress.total + res.data.data.length
    }
  } catch (error) {
    console.log(error, 'error');
    loggingError(error, 'Error Estate')
  }

  return downloadProgress;
};
