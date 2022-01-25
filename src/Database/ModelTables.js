const SCHEMA_VERSION = 35;

// TR = Transaksi
// TM = Master

const TM_USERS = {
  name: 'TM_USERS',
  primaryKey: 'ID',
  properties: {
    ID: 'int?',
    USER_NAME: 'string?',
    ACCESS_TOKEN: 'string?',
    NAME: 'string?',
    JOB_DESC: 'string?',
    ROLE_NAME: 'int?',
    REFERENCE_LOCATION: 'string?',
    LOCATION: 'string?',
    INSERT_TIME: 'date?',
    INSERT_USER: 'string?',
    UPDATE_TIME: 'date?',
    UPDATE_USER: 'string?',
    DELETE_TIME: 'date?',
    DELETE_USER: 'string?',
    LAST_SYNC: 'date?',
    SERVER: 'string?',
  },
};

const TM_PERMISSIONS = {
  name: 'TM_PERMISSIONS',
  primaryKey: 'ID',
  properties: {
    ID: 'int?',
    USER_ID: 'int?',
    NAME: 'string?',
    DESCRIPTION: 'string?',
    INSERT_TIME: 'date?',
    INSERT_USER: 'string?',
    UPDATE_TIME: 'date?',
    UPDATE_USER: 'string?',
    DELETE_TIME: 'date?',
    DELETE_USER: 'string?',
  },
};

const TM_EMPLOYEE = {
  name: 'TM_EMPLOYEE',
  primaryKey: 'ID',
  properties: {
    ID: 'string?',
    TYPE: 'string?',
    SOURCE: 'string?',
    EMPLOYEE_NIK: 'string?',
    EMPLOYEE_FULLNAME: 'string?',
    EMPLOYEE_POSITION: 'string?',
    EMPLOYEE_JOINDATE: 'date?',
    EMPLOYEE_RESIGNDATE: 'date?',
    REGISTER_STATUS: 'string?',
    REFERENCE_LOCATION: 'string?',
    LOCATION: 'string?',
    FACE_DESCRIPTOR: 'string?',
    INSERT_TIME: 'date?',
    INSERT_USER: 'string?',
    REGISTER_TIME: 'date?',
    REGISTER_USER: 'string?',
    UPDATE_TIME: 'date?',
    UPDATE_USER: 'string?',
    DELETE_TIME: 'date?',
    DELETE_USER: 'string?',
    SYNC_STATUS: 'int?',
    SYNC_TIME: 'date?',
  },
};

const TM_AFD = {
  name: 'TM_AFD',
  primaryKey: 'AFD_CODE_GIS',
  properties: {
    NATIONAL: 'string?',
    REGION_CODE: 'string?',
    COMP_CODE: 'string?',
    EST_CODE: 'string?',
    WERKS: 'string?',
    SUB_BA_CODE: 'string?',
    KEBUN_CODE: 'string?',
    AFD_CODE: 'string?',
    AFD_NAME: 'string?',
    AFD_CODE_GIS: 'string?',
    START_VALID: 'date?',
    END_VALID: 'date?',
    INSERT_TIME: 'date?',
    UPDATE_TIME: 'date?',
  },
};

const TM_EST = {
  name: 'TM_EST',
  primaryKey: 'WERKS',
  properties: {
    NATIONAL: 'string?',
    REGION_CODE: 'string?',
    COMP_CODE: 'string?',
    EST_CODE: 'string?',
    WERKS: 'string?',
    EST_NAME: 'string?',
    START_VALID: 'date?',
    END_VALID: 'date?',
    CITY: 'string?',
    INSERT_TIME: 'date?',
    UPDATE_TIME: 'date?',
  },
};

const TM_COMP = {
  name: 'TM_COMP',
  primaryKey: 'COMP_CODE',
  properties: {
    NATIONAL: 'string?',
    REGION_CODE: 'string?',
    COMP_CODE: 'string?',
    COMP_NAME: 'string?',
    ADDRESS: 'string?',
    INSERT_TIME: 'date?',
    UPDATE_TIME: 'date?',
  },
};

const TM_REGION = {
  name: 'TM_REGION',
  primaryKey: 'REGION_CODE',
  properties: {
    NATIONAL: 'string?',
    REGION_CODE: 'string',
    REGION_NAME: 'string?',
    INSERT_TIME: 'date?',
    UPDATE_TIME: 'date?',
  },
};

const TM_SERVICE_LIST = {
  name: 'TM_SERVICE_LIST',
  primaryKey: 'ID',
  properties: {
    ID: 'int?',
    MOBILE_VERSION: 'string?',
    API_NAME: 'string?',
    API_URL: 'string?',
    KETERANGAN: 'string?',
    METHOD: 'string?',
    BODY: 'string?',
  },
};

const TM_ABSENCE_TYPE = {
  name: 'TM_ABSENCE_TYPE',
  primaryKey: 'CODE',
  properties: {
    CODE: 'string?',
    SOURCE: 'string?',
    DESCRIPTION: 'string?',
    TYPE: 'string?',
    INSERT_TIME: 'date?',
    INSERT_USER: 'string?',
    UPDATE_TIME: 'date?',
    UPDATE_USER: 'string?',
    DELETE_TIME: 'date?',
    DELETE_USER: 'string?',
  },
};

const TR_ATTENDANCE = {
  name: 'TR_ATTENDANCE',
  primaryKey: 'ID',
  properties: {
    ID: 'string?',
    EMPLOYEE_ID: 'string?',
    TYPE: 'int?',
    ABSENCE_CODE: 'string?',
    DATETIME: 'date?',
    ACCURACY: 'double?',
    LAT_IN: 'double?',
    LONG_IN: 'double?',
    MANUAL_INPUT: 'int?',
    DESCRIPTION: 'string?',
    INSERT_TIME: 'date?',
    INSERT_USER: 'string?',
    SYNC_STATUS: 'string?',
    SYNC_TIME: 'date?',
  },
};

const TR_IMAGES = {
  name: 'TR_IMAGES',
  primaryKey: 'ID',
  properties: {
    ID: 'string?',
    MODEL: 'string?',
    MODEL_ID: 'string?',
    NAME: 'string?',
    FILE_NAME: 'string?',
    URL: 'string?',
    INSERT_TIME: 'date?',
    INSERT_USER: 'string?',
    SYNC_STATUS: 'string?',
    SYNC_TIME: 'date?',
  },
};

const TR_NOTIFICATION = {
  name: 'TR_NOTIFICATION',
  primaryKey: 'ID',
  properties: {
    ID: 'string?',
    CATEGORY: 'string?',
    TITLE: 'string?',
    MESSAGES: 'string?',
    NAVIGATION: 'string?',
    TO_USERS: 'int?',
    INSERT_TIME: 'date?',
    READ_TIME: 'date?',
  },
};

export default {
  TM_USERS,
  TM_PERMISSIONS,
  TM_EMPLOYEE,
  TM_AFD,
  TM_EST,
  TM_COMP,
  TM_REGION,
  TM_SERVICE_LIST,
  TM_ABSENCE_TYPE,
  TR_ATTENDANCE,
  TR_IMAGES,
  TR_NOTIFICATION,

  SCHEMA_VERSION,
};
