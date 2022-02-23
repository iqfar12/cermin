import Realm from 'realm';
import ModelTables from './ModelTables';

// Initialize a Realm with models
// var defaultPath = Realm.defaultPath;
// var newPath     = defaultPath.substring(0, defaultPath.lastIndexOf('/')) + '/default.realm';
let realmSchema = new Realm({
  // path: newPath,
  schema: [
    ModelTables.TM_USERS,
    ModelTables.TM_PERMISSIONS,
    ModelTables.TM_EMPLOYEE,
    ModelTables.TM_AFD,
    ModelTables.TM_EST,
    ModelTables.TM_COMP,
    ModelTables.TM_REGION,
    ModelTables.TM_SERVICE_LIST,
    ModelTables.TM_ABSENCE_TYPE,
    ModelTables.TR_ATTENDANCE,
    ModelTables.TR_IMAGES,
    ModelTables.TR_NOTIFICATION,
    ModelTables.T_DUPLICATE,
    ModelTables.T_NAVIGATE
  ],
  schemaVersion: ModelTables.SCHEMA_VERSION,
});

export default realmSchema;
