import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';
import { dateGenerator } from '../../../Utils/DateConverter';
import { loggingError } from '../../../Utils/ErrorLogging';

export const getMasterEmployee = async () => {
  const user = TaskServices.getCurrentUser();
  const url = user.SERVER + '/crm-msa-attendance/employee';
  // const url = 'https://192.168.0.108:4000/employee';
  const duplicate_url = user.SERVER + '/crm-msa-attendance/employee-invalid'
  const dbLocal = TaskServices.getAllData('TM_EMPLOYEE').filter((item) => {
    const location = user.LOCATION.split(',');
    if (user.REFERENCE_LOCATION == 'AFD') {
      return location.includes(item.AFD_CODE);
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

  const getDuplicate = async (page = 1) => {
    try {
      const res = await axios.get(duplicate_url + `?join=employee&page=${page}`, {
        headers: {
          Authorization: 'Bearer ' + user.ACCESS_TOKEN
        }
      })
      if (res) {
        if (res.data.data.length > 0) {
          Promise.all(
            res.data.data.map((item) => {
              const data = {
                ID: item.id,
                EMPLOYEE_ID: item.employeeId,
                STATUS: item.registerStatus,
                DESCRIPTION: item.description,
                EMPLOYEE_NIK: item.employeeNik,
                IMAGES: item.images,
              }

              TaskServices.saveData('T_DUPLICATE', data)
            })
          )
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  }

  const getData = async (page = 1, total = 0) => {
    let params = new URLSearchParams();
    params.append('page', page);
    params.append('join', 'faceDescriptor');
    params.append('filter', 'type||$eq||E');
    if (user.LAST_SYNC !== null) {
      params.append('sync', true);
    }
    try {
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
                ID: item.id,
                TYPE: item.type,
                SOURCE: item.source,
                EMPLOYEE_NIK: item.employeeNik,
                EMPLOYEE_FULLNAME: item.employeeFullname,
                EMPLOYEE_POSITION: item.employeePosition,
                EMPLOYEE_JOINDATE: item.employeeJoinDate,
                EMPLOYEE_RESIGNDATE: item.employeeResignDate,
                COMP_CODE: item.compCode,
                WERKS: item.werks,
                JOB_CODE: item.jobCode,
                JOB_TYPE: item.jobType,
                REFERENCE_LOCATION: item.referenceLocation,
                AFD_CODE: item.afdCode,
                FACE_DESCRIPTOR: item.faceDescriptor !== null ? item.faceDescriptor.faceDescriptors : null,
                INSERT_TIME: item.insertTime,
                INSERT_USER: item.insertUser,
                REGISTER_STATUS: item.registerStatus,
                REGISTER_TIME: item.registerTime,
                // REGISTER_USER: item.registerUser,
                UPDATE_TIME: item.updateTime,
                UPDATE_USER: item.updateUser,
                DELETE_TIME: item.deleteTime,
                DELETE_USER: item.deleteUser,
                SYNC_STATUS: 1,
                SYNC_TIME: dateGenerator(),
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
      downloadProgress = {
        ...downloadProgress,
        total: downloadProgress.total + res.data.data.length
      }
    } catch (error) {
      console.log(error, 'error');
      loggingError(error, 'Error Get Employee')
    }
  }

  try {
    const count = await axios.get(duplicate_url, {
      headers: {
        Authorization: 'Bearer ' + user.ACCESS_TOKEN
      }
    })
    if (count) {
      const totalPage = count.data.pageCount
      for (let i = 0; i <= totalPage; i++) {
        await getDuplicate(i)
      }
    }
  } catch (error) {
    console.log(error, 'error')
  }

  try {
    const count = await axios.get(url, {
      headers: {
        'Authorization': 'Bearer ' + user.ACCESS_TOKEN
      }
    })
    if (count) {
      const totalPage = count.data.pageCount
      for (let i = 0; i <= totalPage; i++) {
        await getData(i);
      }
    }
  } catch (error) {
    console.log(error, 'error Employee')
  }

  return downloadProgress;
};
