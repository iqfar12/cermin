import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Sentot, Person } from '../../assets';
import Maison, { Fonts } from '../../Utils/Fonts';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import TaskServices from '../../Database/TaskServices';
import fs from 'react-native-fs';
import * as expoFS from 'expo-file-system';
import SuccessModal from '../../Component/SuccessModal';
import NetInfo from '@react-native-community/netinfo';
import NoConnectionModal from '../../Component/NoConnectionModal';
import axios from 'axios';
import NotSyncModal from '../../Component/NotSyncModal';
import { ImageToBase64 } from '../../Utils/ImageConverter';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = TaskServices.getCurrentUser();
  const Menu = [
    {
      icon: 'cloud-upload',
      title: 'Backup Database',
      arrow: 'chevron-right',
      onNavigation: () => {
        onBackup();
      },
    },
    {
      icon: 'database-export',
      title: 'Export Data Transaksi',
      arrow: 'chevron-right',
      onNavigation: () => {
        onExport();
      },
    },
    {
      icon: 'reload',
      title: 'Reset Master Data',
      arrow: 'chevron-right',
      onNavigation: () => {
        onResetData();
      },
    },
    {
      icon: 'logout',
      title: 'Logout',
      arrow: 'chevron-right',
      onNavigation: () => {
        onLogout();
      },
    },
  ];
  const [backupModal, setBackUpModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [connection, setConnection] = useState(false);
  const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
  const MasterImages = TaskServices.getAllData('TR_IMAGES');
  const [syncModal, setSyncModal] = useState(false);
  const MasterAttendance = TaskServices.getAllData('TR_ATTENDANCE');
  const isFocused = useIsFocused();

  const NotSync = useMemo(() => {
    const EmployeeCount = MasterEmployee.filter((item) => item.SYNC_TIME === null).length
    const AttendanceCount = MasterAttendance.filter((item) => item.SYNC_TIME === null).length
    return EmployeeCount + AttendanceCount
  }, [MasterEmployee, MasterAttendance, isFocused])

  const onLogout = async () => {
    const isConnected = await NetInfo.fetch()
    if (NotSync > 0) {
      setSyncModal(true);
      return;
    }
    if (isConnected.isConnected) {
      const url = user.SERVER + '/crm-msa-auth-data/auth/logout';
      try {
        const res = await axios.post(url, {}, {
          headers: {
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
          }
        })
        if (res) {
          if (NotSync === 0) {
            TaskServices.deleteAllData('TM_USERS');
          } else {
            const data = {
              ID: user.ID,
              ACCESS_TOKEN: null
            }
            TaskServices.saveData('TM_USERS', data)
          }
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
      } catch (error) {
        console.log(error, 'logout');
        setConnection(true)
      }
    } else {
      setConnection(true);
    }
  };

  const onBackup = async () => {
    const realm = TaskServices.getPath();
    const packagePath =
      'file:///storage/emulated/0/Android/media/com.cermin';
    const LocalPath =
      'file:///storage/emulated/0/Android/media/com.cermin/Local';
    const databasePath =
      'file:///storage/emulated/0/Android/media/com.cermin/Local/Database';
    // await expoFS.makeDirectoryAsync(packagePath)
    // await expoFS.makeDirectoryAsync(LocalPath)
    // await expoFS.makeDirectoryAsync(databasePath)
    // await fs.mkdir(packagePath);
    // await fs.mkdir(LocalPath);
    // await fs.mkdir(databasePath);
    const backupPath =
      'file:///storage/emulated/0/Android/media/com.cermin/Local/Database/data.realm';
    await fs.copyFile(realm, backupPath);
    // await expoFS.copyAsync(realm, backupPath);
    console.log('success');
    setBackUpModal(true)
  };

  const DataExportRegister = useMemo(() => {
    return MasterEmployee.filter((item) => item.REGISTER_STATUS !== 'NONE').map((item) => {
      const images = MasterImages.filter((image) => image.MODEL_ID == item.ID)
      item.IMAGES = images.map((image) => ({
        ID: image.ID,
        FILE_NAME: image.FILE_NAME,
        NAME: image.NAME,
        BASE64: image.BASE64
      }))
      return item
    })
  }, [MasterEmployee, MasterImages])


  const onExport = async () => {
    const Attendance = TaskServices.getAllData('TR_ATTENDANCE');
    const AFD = TaskServices.getAllData('TM_AFD');
    const data = {
      TR_ATTENDANCE: Attendance,
      TM_EMPLOYEE: DataExportRegister,
      // TM_AFD: AFD,
    };
    const packagePath =
      'file:///storage/emulated/0/Android/media/com.cermin';
    const LocalPath =
      'file:///storage/emulated/0/Android/media/com.cermin/Local';
    const databasePath =
      'file:///storage/emulated/0/Android/media/com.cermin/Local/Database';
    await fs.mkdir(packagePath);
    await fs.mkdir(LocalPath);
    await fs.mkdir(databasePath);
    const exportPath =
      'file:///storage/emulated/0/Android/media/com.cermin/Local/Database/database.json';
    await fs.writeFile(exportPath, JSON.stringify(data), 'utf8');
    console.log('success');
    setExportModal(true)
  };

  const renderMenu = data => {
    return data?.map((item, index) => (
      <View style={styles.menucontainer} key={index}>
        <TouchableOpacity
          style={styles.touchmenu}
          activeOpacity={0.8}
          onPress={item.onNavigation}
        >
          <View style={styles.lefticoncontainer}>
            <MaterialIcons name={item.icon} size={25} color="#195FBA" />
          </View>
          <View style={styles.menutitlecontainer}>
            <Text style={styles.menutitle}>{item.title}</Text>
          </View>
          <View style={styles.righticoncontainer}>
            <MaterialIcons
              name={item.arrow}
              size={25}
              color="#195FBA"
              style={styles.arrowicon}
            />
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  const showModal = () => {
    if (backupModal) {
      return <SuccessModal title={'Backup Berhasil'} content={'Backup Database Anda Berhasil'} visible={backupModal} onPress={() => setBackUpModal(false)} />
    }
    if (exportModal) {
      return <SuccessModal title={'Export Berhasil'} content={'Export Data Transaksi Anda Berhasil'} visible={exportModal} onPress={() => setExportModal(false)} />
    }
    if (resetModal) {
      return <SuccessModal title={'Reset Berhasil'} content={'Reset Database Anda Berhasil'} visible={resetModal} onPress={() => setResetModal(false)} />
    }
    if (connection) {
      return <NoConnectionModal visible={connection} onClose={() => setConnection(false)} />
    }
    if (syncModal) {
      return <NotSyncModal visible={syncModal} content={'Harap Lakukan Sync Terlebih Dahulu sebelum Logout'} title={'Anda belum Sync'} onPress={() => {
        setSyncModal(false);
        navigation.navigate('Sync');
      }} />
    }
  }

  const onResetData = async () => {
    console.log('resetData');
    const TM_DATA = [
      'TM_PERMISSIONS',
      'TM_EMPLOYEE',
      'TM_AFD',
      'TM_EST',
      'TM_COMP',
      'TM_REGION',
      'TM_SERVICE_LIST',
      'TM_ABSENCE_TYPE',
    ];
    TM_DATA.forEach(async item => {
      TaskServices.deleteAllData(item);
    });
    const data = {
      ID: user.ID,
      LAST_SYNC: null
    }
    await TaskServices.saveData('TM_USERS', data)
    setResetModal(true);
  };

  return (
    <View style={styles.container}>
      {showModal()}
      <View style={styles.top}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={Person} />
          <Text style={styles.username}>{user.NAME}</Text>
          <Text style={styles.companyname}>{user.COMP_NAME}</Text>
          <View style={styles.rolecontainer}>
            <Text style={styles.role}>{user?.ROLE_NAME}</Text>
          </View>
        </View>
      </View>
      <View style={styles.middle}>{renderMenu(Menu)}</View>
      <View style={styles.bottom}>
        <Text style={styles.version}>mobile version v1.0.0</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 1,
    backgroundColor: '#195FBA',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 120,
    width: 120,
  },
  username: {
    fontFamily: Maison,
    fontSize: 24,
    color: '#FFF',
    fontWeight: '700',
    paddingTop: 10,
  },
  companyname: {
    fontFamily: Maison,
    fontSize: 16,
    color: '#CFCFCF',
    fontWeight: '400',
    paddingTop: 4,
  },
  rolecontainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D7EAFE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 8,
  },
  role: {
    fontFamily: Maison,
    fontSize: 16,
    textAlignVertical: 'center',
    color: '#195FBA',
    fontWeight: '700',
  },
  middle: {
    flex: 1,
    marginTop: 20,
  },
  bottom: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menucontainer: {
    paddingVertical: 5,
  },
  touchmenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 20,
  },
  lefticoncontainer: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#D7EAFE',
  },
  menutitlecontainer: {
    flex: 2,
  },
  menutitle: {
    fontFamily: Maison,
    fontSize: 16,
    color: '#383636',
    fontWeight: '700',
  },
  righticoncontainer: {
    flex: 1,
  },
  arrowicon: {
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  version: {
    fontSize: 16,
    fontFamily: Fonts.book,
    color: '#383636',
    marginBottom: 25,
  }
});
