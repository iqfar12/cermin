import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';

export const getMasterCompany = async () => {
  const user = TaskServices.getCurrentUser();
  const dbLocal = TaskServices.getAllData('TM_COMP');
  const url = 'http://192.168.100.40:3010/companies';

  let donwloadProgress = {
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
              COMP_NAME: item.compName,
              ADDRESS: item.address,
              INSERT_TIME: item.insertTime,
              UPDATE_TIME: item.updateTime,
            };

            TaskServices.saveData('TM_COMP', data);

            donwloadProgress = {
              ...donwloadProgress,
              count: donwloadProgress.count + 1,
            };
          }),
        );
      }
    }
  } catch (error) {
    console.log(error, 'error');
  }

  return donwloadProgress;
};
