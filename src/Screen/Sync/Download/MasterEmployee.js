import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';

export const getMasterEmployee = async () => {
  const user = TaskServices.getCurrentUser();
  const dbLocal = TaskServices.getAllData('TM_EMPLOYEE');
  const url = 'http://apis-dev1.tap-agri.com/crm-msa-attendance/employee';

  let downloadProgress = {
    count: 0,
    total: dbLocal.length,
  };

  const getData = async (page = 1) => {
    console.log(page);
    try {
      const res = await axios.get(url + `?page=${page}`, {
        headers: {
          Authorization: 'Bearer ' + user.ACCESS_TOKEN,
        },
      });
      if (res) {
        if (res.data.data.length > 0) {
          Promise.all(
            res.data.data.map(item => {
              const data = {
                ID: item.id,
                TYPE: item.type,
                SOURCE: item.source,
                EMPLOYEE_NIK: item.employeeNik,
                EMPLOYEE_FULLNAME: item.employeeFullname,
                EMPLOYEE_POSITION: item.employeePosition,
                EMPLOYEE_JOINDATE: item.employeeJoinDate,
                EMPLOYEE_RESIGNDATE: item.employeeResignDate,
                AFD_CODE_GIS: item.afdCodeGis,
                FACE_DESCRIPTOR: item.faceDescriptor,
                INSERT_TIME: item.insertTime,
                INSERT_USER: item.insertUser,
                REGISTER_TIME: item.registerTime,
                REGISTER_USER: item.registerUser,
                UPDATE_TIME: item.updateTime,
                UPDATE_USER: item.updateUser,
                DELETE_TIME: item.deleteTime,
                DELETE_USER: item.deleteUser,
                SYNC_STATUS: 1,
                SYNC_TIME: new Date(),
              };
  
              TaskServices.saveData('TM_EMPLOYEE', data);
  
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
  }

  try {
    const count = await axios.get(url, {
      headers: {
        'Authorization': 'Bearer ' + user.ACCESS_TOKEN
      }
    })
    if (count) {
      const totalPage = count.data.pageCount
      for (let i = 0; i <= 3; i++) {
        await getData(i);
      }
    }
  } catch (error) {
    console.log(error, 'error Employee')
  }

  return downloadProgress;
};
