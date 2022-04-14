import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';
import { loggingError } from '../../../Utils/ErrorLogging';

export const getMasterCompany = async () => {
  const user = TaskServices.getCurrentUser();
  const url =  user.SERVER + '/crm-msa-attendance/companies';
  const dbLocal = TaskServices.getAllData('TM_COMP').filter((item) => {
    const location = user.LOCATION.split(',').map(a => a.substr(0, 2));
    return location.includes(item.COMP_CODE);
  })
  console.log(dbLocal, 'company')

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
              COMP_NAME: item.compName,
              ADDRESS: item.address,
              INSERT_TIME: item.insertTime,
              UPDATE_TIME: item.updateTime,
            };

            TaskServices.saveData('TM_COMP', data);

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
    loggingError(error, 'Error Company')
  }

  return downloadProgress;
};
