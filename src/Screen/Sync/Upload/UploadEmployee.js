import TaskServices from "../../../Database/TaskServices"
import axios from "axios";

export const uploadSyncEmployee = async () => {
    const dbLocal = TaskServices.getAllData('TM_EMPLOYEE').filter((item) => item.SYNC_TIME === null);
    const user = TaskServices.getCurrentUser();
    const url = 'https://apis-dev1.tap-agri.com/crm-msa-attendance/employee/register';
    // const url = 'http://192.168.0.108:4000/employee/register';
    const MasterImages = TaskServices.getAllData('TR_IMAGES')

    let uploadCount = {
        count: 0,
        total: dbLocal.length
    }

    if (dbLocal.length > 0) {
        await Promise.all(
            dbLocal.map(async (item) => {
                let formData = new FormData();
                const images = MasterImages.filter((data) => data.MODEL_ID == item.ID);
                images.forEach((item, index) => {
                    if (index < 4) {
                        formData.append('images', {
                            uri: `file://${item.URL}`,
                            name: `${item.FILE_NAME}_${index}.jpeg`,
                            type: 'image/jpeg'
                        })
                    }
                })
                if (item.TYPE == 'E') {
                    formData.append('id', item.ID)
                } else {
                    formData.append('employeeNik', item.EMPLOYEE_NIK)
                    formData.append('employeeFullname', item.EMPLOYEE_FULLNAME)
                    if (item.AFD_CODE !== null) {
                        formData.append('afdCode', item.AFD_CODE)
                    }
                    if (item.COMP_CODE !== null) {
                        formData.append('compCode', item.COMP_CODE)
                    }
                    if (item.WERKS !== null) {
                        formData.append('werks', item.WERKS)
                    }
                }
                console.log(formData, 'body')
                try {
                    const res = await axios.post(url, formData, {
                        headers: {
                            'Authorization': 'Bearer ' + user.ACCESS_TOKEN,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (res) {
                        console.log(res.data, 'res upload')

                        uploadCount = {
                            ...uploadCount,
                            count: uploadCount.count + 1
                        }

                        const data = {
                            ID: item.ID,
                            SYNC_TIME: new Date(),
                            SYNC_STATUS: 1,
                        }

                     TaskServices.saveData('TM_EMPLOYEE', data)
                    }
                } catch (error) {
                    console.log(error, 'error register')
                }
            })
        )
    }

    return uploadCount
}