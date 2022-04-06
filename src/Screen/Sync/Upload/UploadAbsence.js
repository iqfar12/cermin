import TaskServices from "../../../Database/TaskServices"
import axios from "axios";
import { dateGenerator } from "../../../Utils/DateConverter";
import { loggingError } from "../../../Utils/ErrorLogging";

export const uploadAbsence = async () => {
    const dbLocal = TaskServices.getAllData('TR_ATTENDANCE')
        .filter((item) => item.SYNC_TIME === null)
    const user = TaskServices.getCurrentUser();
    const url = user.SERVER + '/crm-msa-attendance/attendances/absence/mobile';
    // const url = 'http://192.168.100.40:4000/attendances/absence/mobile';

    let uploadCount = {
        count: 0,
        total: dbLocal.length
    }

    if (dbLocal.length > 0) {
        await Promise.all(
            dbLocal.map(async (item) => {
                let body = {
                    employeeId: item.EMPLOYEE_ID,
                    description: item.DESCRIPTION,
                    longIn: item.LONGITUDE,
                    latIn: item.LATITUDE,
                    datetime: item.DATETIME,
                    type: parseInt(item.TYPE, 10),
                    absenceCode: item.ABSENCE_CODE,
                    accuracy: Math.abs((1 - item.ACCURACY) * 100),
                    insertTime: item.DATETIME,
                    manualInput: item.MANUAL_INPUT === 0 ? "N" : "Y"
                }
                console.log(body, 'body')
                try {
                    const res = await axios.post(url, body, {
                        headers: {
                            Authorization: 'Bearer ' + user.ACCESS_TOKEN
                        }
                    })
                    if (res) {

                        console.log(res.data, 'attendance')

                        uploadCount = {
                            ...uploadCount,
                            count: uploadCount.count + 1
                        }

                        let data = {
                            ID: item.ID,
                            SYNC_TIME: dateGenerator(),
                            SYNC_STATUS: "1"
                        }

                        TaskServices.saveData('TR_ATTENDANCE', data)
                    }
                } catch (error) {
                    console.log(error.response, 'error upload attendance')
                    loggingError(error, 'Error Upload Attendance')
                }
            })
        )
    }

    return uploadCount
}