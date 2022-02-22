import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';

export const getMasterRegion = async () => {
  const user = TaskServices.getCurrentUser();
  const dbLocal = TaskServices.getAllData('TM_REGION');
  const url = 'https://apis-dev1.tap-agri.com/crm-msa-attendance/region';

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
      params: params,
    });
    if (res) {
      if (res.data.data.length > 0) {
        Promise.all(
          res.data.data.map(item => {
            const data = {
              NATIONAL: item.national,
              REGION_CODE: item.regionCode,
              REGION_NAME: item.regionName,
              INSERT_TIME: item.insertTime,
              UPDATE_TIME: item.updateTime,
            };

            TaskServices.saveData('TM_REGION', data);

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
  }

  return downloadProgress;
};
