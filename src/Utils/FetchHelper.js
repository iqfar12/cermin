import TaskServices from '../Database/TaskServices';
import axios from 'axios';

export const fetchGet = async (serviceName, fetchHeaders = null) => {
  const service = TaskServices.getService(serviceName);
  const user = TaskServices.getCurrentUser();

  let headers = null;
  if (fetchHeaders !== null && fetchHeaders !== undefined) {
    headers = {
      ...fetchHeaders,
      Authorization: 'Bearer ' + user.ACCESS_TOKEN,
    };
  } else {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.ACCESS_TOKEN,
    };
  }

  let data = null;

  try {
    const res = await axios.get(service.API_URL, {
      headers: headers,
    });
    if (res) {
      data = res.data;
    } else {
      data = null;
    }
  } catch (error) {
    console.log(error, 'error');
    data = null;
  }

  return data;
};
