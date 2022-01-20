import TaskServices from "../../../Database/TaskServices"
import axios from "axios";

export const uploadSyncEmployee = async () => {
    const dbLocal = TaskServices.getAllData('TM_EMPLOYEE').filter((item) => item.SYNC_TIME === null);
    const user = TaskServices.getCurrentUser();
    const url = 'http://apis-dev1.tap-agri.com/crm-msa-attendance/employee/register';
    const MasterImages = TaskServices.getAllData('TR_IMAGES')

    let uploadCount = {
        count: 0,
        total: dbLocal.length
    }

    if (dbLocal.length > 0) {
        dbLocal.forEach( async (item) => {
            let formData = new FormData();
            const images = MasterImages.filter((data) => data.MODEL_ID == item.ID);
            images.forEach((item, index) => {
                formData.append('images', {
                    uri: `file://${item.URL}`,
                    name: `${item.FILE_NAME}_${index}.jpeg`,
                    type: 'image/jpeg'
                })
            })
            formData.append('employeeNik', item.EMPLOYEE_NIK)
            formData.append('employeeFullname', item.EMPLOYEE_FULLNAME)
            formData.append('afdCode', item.AFD_CODE)
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
               }
            } catch (error) {
                console.log({...error}, 'error')
            }
        })
    }

    return uploadCount
}