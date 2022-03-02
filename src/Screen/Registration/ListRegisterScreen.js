import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import SubHeader from '../../Component/SubHeader';
import Icon from '@expo/vector-icons/MaterialIcons'
import TaskServices from '../../Database/TaskServices';
import { dateGenerator } from '../../Utils/DateConverter';

const RightComponent = ({ navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('History Register')}
            activeOpacity={0.8}
            style={styles.right}
        >
            <Text style={styles.rightTxt}>Riwayat</Text>
            <Icon name={'history'} size={25} color={'#FFF'} />
        </TouchableOpacity>
    );
};

const ListRegisterScreen = () => {
    const navigation = useNavigation();
    const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
    const [search, setSearch] = useState('');
    const isFocused = useIsFocused();
    const user = TaskServices.getCurrentUser();
    const DuplicateEmployee = TaskServices.getAllData('T_DUPLICATE');
    
    const ListEmployee = useMemo(() => {
        const duplicateId = DuplicateEmployee.map((item) => item.EMPLOYEE_ID);
        const location = user.LOCATION.split(',');
        const res = MasterEmployee.filter((item) => item.REGISTER_STATUS == 'NONE' || item.REGISTER_STATUS == 'REJECTED')
        let data = res;
        if (user.REFERENCE_LOCATION == 'AFD') {
            data = res.filter((item) => location.includes(item.AFD_CODE))
        } else if (user.REFERENCE_LOCATION == 'BA') {
            data = res.filter((item) => location.includes(item.WERKS))
        } else if (user.REFERENCE_LOCATION == 'COMP') {
            data = res.filter((item) => location.includes(item.COMP_CODE))
        } else {
            // TODO: HO Need Filter!!
            data = res
        }

        if (search !== '') {
            return data.filter((item) => item.EMPLOYEE_FULLNAME.toLowerCase().includes(search.toLowerCase()))
        } else {
            return data
        }
    }, [MasterEmployee, search, isFocused])

    const onRegister = async (data) => {
        const body = {
          ID: data?.ID,
          TYPE: 'E',
          SOURCE: data?.SOURCE,
          EMPLOYEE_NIK: data?.EMPLOYEE_NIK.split(' ').join(''),
          EMPLOYEE_FULLNAME: data?.EMPLOYEE_FULLNAME,
          EMPLOYEE_POSITION: data?.EMPLOYEE_POSITION,
          EMPLOYEE_JOINDATE: data?.EMPLOYEE_JOINDATE,
          EMPLOYEE_RESIGNDATE: data?.EMPLOYEE_RESIGNDATE,
          REFERENCE_LOCATION: data?.REFERENCE_LOCATION,
          AFD_CODE: data?.AFD_CODE,
          COMP_CODE: data?.COMP_CODE,
          WERKS: data?.WERKS,
          REGISTER_STATUS: 'PROCESS',
          FACE_DESCRIPTOR: data?.FACE_DESCRIPTOR,
          INSERT_TIME: dateGenerator(),
          INSERT_USER: user?.USER_NAME,
          REGISTER_TIME: dateGenerator(),
          REGISTER_USER: user.USER_NAME,
          UPDATE_TIME: dateGenerator(),
          UPDATE_USER: user.USER_NAME,
          DELETE_TIME: null,
          DELETE_USER: null,
          SYNC_STATUS: null,
          SYNC_TIME: null,
        };
    
        navigation.navigate('Registration', { screen: 'Registration Home', params: { data: body } });
      };

    const renderListCard = ({ item, index }) => {
        const location = () => {
            if (user.REFERENCE_LOCATION == 'AFD') {
                return item.AFD_CODE
            } else if (user.REFERENCE_LOCATION == 'BA') {
                return item.WERKS
            } else {
                return item.COMP_CODE
            }
        }
        const isPermission = user.PERMISSION.map((item) => item.includes('mobile-registrasi')).includes(true);
        return (
            <TouchableOpacity activeOpacity={0.8} disabled={!isPermission} onPress={() => onRegister(item)} style={styles.card}>
                <View style={styles.cardLeft}>
                    <Text style={styles.name}>{item.EMPLOYEE_FULLNAME}</Text>
                    <Text style={styles.nik}>{item.EMPLOYEE_NIK} </Text>
                </View>
                <View style={styles.cardRight}>
                    <View style={styles.location}>
                        <Icon name={'location-pin'} size={20} color={'#C5C5C5'} />
                        <Text style={styles.locationTxt}>{location()}</Text>
                    </View>
                    <Icon name={'keyboard-arrow-right'} size={25} color={'#2F78D7'} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.wrapper}>
            <SubHeader
                right={<RightComponent navigation={navigation} />}
                onBack={() => navigation.goBack()}
                title={'Kembali'}
            />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>User Belum Terdaftar ({ListEmployee.length})</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.search}>
                        <Icon name={'search'} size={25} color={'#C5C5C5'} />
                        <TextInput style={styles.input} value={search} onChangeText={(val) => setSearch(val)} placeholder={'Cari Nama/Nik'} />
                    </View>
                    {/* <View style={styles.tagContainer}>
                        <TouchableOpacity style={styles.more}>
                            <Icon name={'tune'} size={25} color={'#000'} />
                        </TouchableOpacity>
                        <View style={styles.tag}>
                            <Text style={styles.tagTitle}>4213B</Text>
                            <Icon name={'cancel'} size={20} color={'#FFF'} />
                        </View>
                    </View> */}
                    <FlatList
                     data={ListEmployee}
                     renderItem={renderListCard}
                     keyExtractor={(_, i) => i.toString()}
                     contentContainerStyle={styles.list}
                     showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    )
}

export default ListRegisterScreen

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F0F2F2',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        marginRight: 25,
    },
    rightTxt: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: '#FFF',
        marginRight: 10,
    },
    header: {
        paddingHorizontal: 20,
        backgroundColor: '#195FBA',
        paddingBottom: 20,
        paddingTop: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 30,
    },
    input: {
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: Fonts.book,
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#C5C5C5',
    },
    more: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#C5C5C5',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        backgroundColor: '#195FBA',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 20,
    },
    tagTitle: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: '#FFF',
        marginRight: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 0.5,
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingRight: 20,
        paddingLeft: 12,
        paddingVertical: 16,
        marginBottom: 10,
    },
    cardLeft: {
        borderRightWidth: 1,
        borderColor: '#C5C5C5',
        paddingRight: 10,
        marginRight: 20,
        width: '55%',
    },
    name: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#000',
    },
    nik: {
        fontSize: 14,
        fontFamily: Fonts.book,
        color: '#6C6C6C',
    },
    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 35,
    },
    locationTxt: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#6C6C6C',
        marginLeft: 5,
    },
    list: {
        paddingTop: 24,
        paddingBottom: 200,
    }
})
