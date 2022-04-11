import TaskServices from "../Database/TaskServices"
import { dateGenerator } from "./DateConverter";

export const loggingError = (error, desc) => {
    const MasterLog = TaskServices.getAllData('T_LOG');
    let body = {
        ID: MasterLog.length,
        ERROR: error.response.data.statusCode !== undefined ? JSON.stringify(error.response.data) : JSON.stringify(error.toJSON().message),
        TICKET_NUMBER: error.response.data.statusCode !== undefined && error.response.data.statusCode < 500 ? '#1' : '#2',
        DATETIME: dateGenerator(),
        DESCRIPTION: desc
    }

    TaskServices.saveData('T_LOG', body)
}