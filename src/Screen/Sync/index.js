import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import ProgressSyncBar from '../../Component/ProgressSyncBar';
import {getMasterDataset} from './Download/MasterDataset';
import {Fonts} from '../../Utils/Fonts';
import LottieView from 'lottie-react-native';
import {Sync} from '../../assets';
import SyncNotif from '../../Component/SyncNotif';
import NetInfo from '@react-native-community/netinfo';
import NoConnectionModal from '../../Component/NoConnectionModal';
import TaskServices from '../../Database/TaskServices';
import {getMasterAfdeling} from './Download/MasterAfdeling';
import {getMasterCompany} from './Download/MasterCompany';
import {getMasterEst} from './Download/MasterEst';
import {getMasterRegion} from './Download/MasterRegion';
import {getMasterEmployee} from './Download/MasterEmployee';

const Percentage = () => {
  return (
    <View style={styles.percentage}>
      <Text style={styles.percentageSum}>
        30<Text style={styles.symbol}>%</Text>
      </Text>
    </View>
  );
};

const SyncScreen = () => {
  const navigation = useNavigation();
  const [sync, setSync] = useState(false);
  const [masterDataset, setMasterDataset] = useState({
    progress: 0,
    total: 0,
  });
  const [animation, setAnimation] = useState();
  const [loop, setLoop] = useState(false);
  const [connection, setConnection] = useState(false);
  const [masterAfdeling, setMasterAfdeling] = useState({
    progress: 0,
    total: 0,
  });
  const [masterCompanies, setMasterCompanies] = useState({
    progress: 0,
    total: 0,
  });
  const [masterEst, setMasterEst] = useState({
    progress: 0,
    total: 0,
  });
  const [masterRegion, setMasterRegion] = useState({
    progress: 0,
    total: 0,
  });
  const [masterEmployee, setMasterEmployee] = useState({
    progress: 0,
    total: 0,
  });

  const syncDownload = async () => {
    // Get Master Afdeling
    getMasterAfdeling().then(data => {
      setMasterAfdeling({
        progress: data.count,
        total: data.total,
      });
    });

    // Get Master Companies
    getMasterCompany().then(data => {
      setMasterCompanies({
        progress: data.count,
        total: data.total,
      });
    });

    // Get Master Estate
    getMasterEst().then(data => {
      setMasterEst({
        progress: data.count,
        total: data.total,
      });
    });

    // Get Master Region
    getMasterRegion().then(data => {
      setMasterRegion({
        progress: data.count,
        total: data.total,
      });
    });

    // Get Master Employee
    getMasterEmployee().then(data => {
      setMasterEmployee({
        progress: data.count,
        total: data.total,
      });
    });
  };

  const onSync = async () => {
    const isConnected = await NetInfo.fetch();
    if (isConnected.isConnected) {
      setSync(!sync);
      setLoop(true);
      animation.play();
      updateUserSync();

      await syncDownload();

      setTimeout(() => {
        setSync(false);
        setLoop(false);
      }, 3000);
    } else {
      setConnection(true);
    }
  };

  const updateUserSync = async () => {
    const user = TaskServices.getCurrentUser();
    const data = {
      ID: user.ID,
      LAST_SYNC: new Date(),
    };

    await TaskServices.saveData('TM_USERS', data);
  };

  useEffect(() => {
    if (animation) {
      onSync();
    }
  }, [animation]);

  const showModal = () => {
    if (connection) {
      return (
        <NoConnectionModal
          visible={connection}
          onClose={() => setConnection(false)}
        />
      );
    }
  };

  return (
    <>
      {showModal()}
      <StatusBar backgroundColor={'#0E5CBE'} />
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View style={styles.header}>
            <Icon
              name={'arrow-left'}
              size={25}
              color={'#F0F2F2'}
              style={styles.back}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerTitle}>Sinkronisasi Data</Text>
          </View>
          <SyncNotif />
          <View style={styles.syncContainer}>
            <LottieView
              ref={ref => setAnimation(ref)}
              source={Sync}
              loop={loop}
              autoSize={true}
            />
            {!sync ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onSync}
                style={styles.sync}
              >
                <Text style={styles.syncTxt}>Sync</Text>
              </TouchableOpacity>
            ) : (
              <Percentage />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Data</Text>
            <ProgressSyncBar
              title={'Attendance'}
              total={masterDataset.total}
              progress={masterDataset.progress}
              sync={sync}
            />
            <ProgressSyncBar
              title={'Images'}
              total={masterDataset.total}
              progress={masterDataset.progress}
              sync={sync}
            />
            <ProgressSyncBar
              title={'Master Data Karyawan'}
              total={masterDataset.total}
              progress={masterDataset.progress}
              sync={sync}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Download Data</Text>
            <ProgressSyncBar
              title={'Master Afdeling'}
              total={masterAfdeling.total}
              progress={masterAfdeling.progress}
              sync={sync}
            />
            <ProgressSyncBar
              title={'Master Companies'}
              total={masterCompanies.total}
              progress={masterCompanies.progress}
              sync={sync}
            />
            <ProgressSyncBar
              title={'Master Estate'}
              total={masterEst.total}
              progress={masterEst.progress}
              sync={sync}
            />
            <ProgressSyncBar
              title={'Master Region'}
              total={masterRegion.total}
              progress={masterRegion.progress}
              sync={sync}
            />
            <ProgressSyncBar
              title={'Master Employee'}
              total={masterEmployee.total}
              progress={masterEmployee.progress}
              sync={sync}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default SyncScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#0E5CBE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 50,
  },
  button: {
    backgroundColor: '#0E5CBE',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    width: '50%',
    paddingVertical: 10,
    borderRadius: 30,
  },
  buttonTitle: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: Fonts.bold,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    fontFamily: Fonts.bold,
    marginBottom: 20,
  },
  back: {
    position: 'absolute',
    left: 0,
    padding: 16,
    alignSelf: 'center',
  },
  scroll: {
    paddingBottom: 35,
  },
  syncContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sync: {
    position: 'absolute',
    backgroundColor: '#195FBA',
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  syncTxt: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFF',
  },
  percentage: {
    position: 'absolute',
  },
  percentageSum: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  symbol: {
    fontSize: 14,
  },
});
