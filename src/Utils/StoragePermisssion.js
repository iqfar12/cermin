const { NativeModules } = require('react-native');
const modules = NativeModules.PermissionManager;

const normalizeFilePath = (path) => (path.startsWith('file://') ? path.slice(7) : path);

export const requestAdvanceStoragePermission = async () => {
    let res;
    try {
        res = await modules.requestAllStoragePermission();
        console.log(res, 'permission storage')
    } catch (error) {
        console.log(error, 'error permission')
    }
    return res;
}

export const lockTimezone = async () => {
    // return "Need to Proccess"
    let res;
    try {
        res = await modules.LockTimezone();
        console.log(res, 'lock timezone')
    } catch (error) {
        console.log(error, 'error lock timezone')
    }
    return res
}

export const checkTimezoneSetting = async () => {
    let res = false;
    try {
        res = await modules.checkTimezoneSetting();
        // console.log(res, 'status time setting');
    } catch (error) {
        console.log(error, 'error check ')
    }
    return res
}

export const writeFile = async (path, content) => {
    let res = "failed";
    try {
        res = await modules.writeFile(path, content)        
    } catch (error) {
        console.log(error, 'error writefile')
    }
    return res
}