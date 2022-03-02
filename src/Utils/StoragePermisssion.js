const {NativeModules} = require('react-native');
const modules = NativeModules.PermissionManager;


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