import TaskServices from '../../../Database/TaskServices';
import axios from 'axios';

export const AbsenceCode = async () => {
    const user = TaskServices.getCurrentUser();
    const dbLocal = TaskServices.getAllData('TM_ABSENCE_TYPE');
    const url = 'http://apis-dev1.tap-agri.com/crm-msa-attendance/absences?page=1&limit=1000';

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
                            CODE: item.code,
                            SOURCE: item.source,
                            DESCRIPTION: item.description,
                            TYPE: item.type,
                            INSERT_TIME: item.insertTime,
                            INSERT_USER: user.USER_NAME,
                            UPDATE_TIME: item.updateTime,
                            UPDATE_USER: user.USER_NAME,
                            DELETE_TIME: null,
                            DELETE_USER: null,
                        };

                        TaskServices.saveData('TM_ABSENCE_TYPE', data);

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
