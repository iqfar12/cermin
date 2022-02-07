import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons'

// Header
import SubHeader from '../../Component/SubHeader';

// Font
import { Fonts } from '../../Utils/Fonts';
import BottomModal from "../../Component/BottomModal";
import TaskServices from "../../Database/TaskServices";
import MenuModal from "../../Component/MenuModal";
import { UuidGenerator } from "../../Utils/UuidGenerator";


const RightComponent = ({ navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('History Agenda')}
            activeOpacity={0.8}
            style={styles.right}
        >
            <Text style={styles.rightTxt}>Riwayat</Text>
            <Icon name={'history'} size={25} color={'#FFF'} />
        </TouchableOpacity>
    );
};


const LeaveScreen = () => {
    const navigation = useNavigation();
    const [userModal, setUserModal] = useState(false)
    const [userSearch, setUserSearch] = useState('');
    const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
    const MasterAbsenceType = TaskServices.getAllData('TM_ABSENCE_TYPE');
    const [user, setUser] = useState();
    const [descrip, setDescrip] = useState('')
    const [leaveType, setLeaveType] = useState();
    const [typeModal, setTypeModal] = useState(false);

    const ListEmployee = useMemo(() => {
        if (userSearch !== '') {
            return MasterEmployee.filter((item) =>
                item.EMPLOYEE_NIK.split(' ').join('').includes(userSearch) ||
                item.EMPLOYEE_FULLNAME.toLowerCase().includes(userSearch.toLowerCase()))
        } else {
            return MasterEmployee;
        }
    }, [MasterEmployee, userSearch])

    const onPickEmployee = (val) => {
        setUser(val);
        setUserSearch('');
        setUserModal(false);
    }

    const renderEmployee = ({ item, index }) => {
        const nik = item.EMPLOYEE_NIK.split(' ').join('');
        return (
            <TouchableOpacity
                onPress={() => onPickEmployee(item)}
                key={index}
                activeOpacity={0.8}
                style={styles.modalButton}
            >
                <Text style={styles.modalButtonTitle}>{nik} - {item.EMPLOYEE_FULLNAME}</Text>
            </TouchableOpacity>
        )
    }

    const onPickType = (val) => {
        setLeaveType(val);
        setTypeModal(false)
    }

    const onLeave = () => {
        const id = UuidGenerator();
        const type = MasterAbsenceType.find((item) => item.CODE == leaveType)?.TYPE;
        const data = {
            ID: id,
            EMPLOYEE_ID: user.ID,
            TYPE: '4',
            ABSENCE_CODE: leaveType,
            DATETIME: new Date(),
            ACCURACY: null,
            LATITUDE: null,
            LONGITUDE: null,
            MANUAL_INPUT: 1,
            DESCRIPTION: descrip,
            INSERT_TIME: new Date(),
            INSERT_USER: user.EMPLOYEE_NIK,
            SYNC_STATUS: null,
            SYNC_TIME: null,
        }

        TaskServices.saveData('TR_ATTENDANCE', data);
        navigation.replace('History Agenda')
    }

    const showModal = () => {
        if (userModal) {
            return (
                <BottomModal
                    visible={userModal}
                    onClose={() => {
                        setUserModal(false)
                        setUserSearch('')
                    }}
                    title={'Pilih User'}
                    search={true}
                    searchPlaceholder={'Cari Nama/Nik'}
                    searchValue={userSearch}
                    onSearch={(val) => setUserSearch(val)}
                    titleBottomButton={'Tutup'}
                    size={0.5}
                    bottomOnPress={() => {
                        setUserModal(false)
                        setUserSearch('');
                    }}>
                    <FlatList
                        data={ListEmployee}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderEmployee}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                </BottomModal>
            )
        }
        if (typeModal) {
            return (
                <MenuModal onClose={() => setTypeModal(false)} visible={typeModal}>
                    {MasterAbsenceType.filter((item) => item.TYPE === 'EXCUSED').map((item, index) => (
                        <TouchableOpacity
                            onPress={() => onPickType(item.CODE)}
                            key={index}
                            activeOpacity={0.8}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonTitle}>{item.DESCRIPTION}</Text>
                            <Icon name={'adjust'} size={25} color={'#195FBA'} />
                        </TouchableOpacity>
                    ))}
                </MenuModal>
            );
        }
    }

    const onDisabled = () => {
        if (user === undefined || descrip === '') {
            return true
        } else {
            return false
        }
    }

    return (
        <View style={styles.container}>
            {showModal()}
            <View style={styles.top}>
                <SubHeader
                    right={<RightComponent navigation={navigation} />}
                    onBack={() => navigation.goBack()}
                    title={'Kembali'}
                />
            </View>
            <View style={styles.Title}>
                <Text style={styles.TextTitle}>Surat Izin</Text>
                <Text style={styles.TextSubTitle}>Isi keterangan berikut untuk memberikan izin</Text>
            </View>
            <View style={styles.AccountContainer}>
                <Text style={styles.AccountTitle}>Pilih Akun</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setUserModal(true)} style={styles.TouchAccount}>
                    <Icon name="person" size={24} color="#C5C5C5" />
                    <View style={styles.ContentContainer}>
                        <Text style={styles.TextContent} numberOfLines={1} ellipsizeMode={'tail'}>{user ? user.EMPLOYEE_NIK : 'Pilih User'} <Text style={styles.TextSubContent}>{user ? `| ${user.EMPLOYEE_FULLNAME}` : ''}</Text></Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
            </View>
            <View style={styles.ContainerLeaveType}>
                <Text style={styles.LeaveTitle}>Lokasi</Text>
                <TouchableOpacity style={styles.LeaveContent}>
                    <Icon name="location-pin" size={24} color="#C5C5C5" />
                    <View style={styles.ContainerTextLeave}>
                        <Text style={styles.TextLeave}>{user ? user.WERKS : 'Lokasi'}</Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
                <Text style={styles.LeaveTitle}>Jenis Izin</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setTypeModal(true)} style={styles.LeaveContent}>
                    <View style={styles.ContainerTextLeave}>
                        <Text style={styles.TextLeave}>{MasterAbsenceType.find((item) => item.CODE === leaveType)?.DESCRIPTION || 'Pilih Jenis Izin'}</Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
                <Text style={styles.LeaveTitle}>Keterangan</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={'Alasan Izin'}
                        value={descrip}
                        onChangeText={(val) => setDescrip(val)}
                        style={styles.input} />
                </View>
                {/* <TouchableOpacity style={styles.LeaveContent}>
                    <View style={styles.ContainerTextLeave}>
                        <Text style={styles.TextLeave}>Sakit Perut</Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity> */}
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity disabled={onDisabled()} activeOpacity={0.8} onPress={onLeave} style={[styles.TouchButton, onDisabled() && { backgroundColor: '#C5C5C5' }]}>
                    <Text style={styles.TextButton}>Berikan Izin</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    top: {
        backgroundColor: '#195FBA',
        elevation: 2
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
    Title: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        justifyContent: 'center'
    },
    TextTitle: {
        fontFamily: Fonts.bold,
        fontSize: 24,
        marginHorizontal: 40,
    },
    TextSubTitle: {
        fontFamily: Fonts.book,
        fontSize: 15,
        marginLeft: 40,
        color: '#6C6C6C'
    },
    AccountContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        justifyContent: 'center',
        marginBottom: 15,
    },
    AccountTitle: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        marginHorizontal: 40,
        color: '#6C6C6C'
    },
    TouchAccount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 40,
        marginTop: 10,
        paddingVertical: 13,
        borderRadius: 30,
        borderColor: '#195FBA',
        borderWidth: 3
    },
    ContentContainer: {
        width: '70%',
    },
    TextContent: {
        fontFamily: Fonts.bold
    },
    TextSubContent: {
        fontFamily: Fonts.book,
        color: '#383636'
    },
    ContainerLeaveType: {
        flex: 2,
        justifyContent: 'space-evenly'
    },
    LeaveTitle: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        marginHorizontal: 40,
        color: '#6C6C6C'
    },
    LeaveContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 30,
        paddingVertical: 16,
        borderRadius: 30,
        borderColor: '#C5C5C5',
        borderWidth: 1
    },
    ContainerTextLeave: {
        width: '70%',
    },
    TextLeave: {
        fontFamily: Fonts.book
    },
    ButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    TouchButton: {
        paddingVertical: 16,
        paddingHorizontal: 120,
        backgroundColor: '#195FBA',
        borderRadius: 20
    },
    TextButton: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: '#FFF'
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D7EAFE',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    modalButtonTitle: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#000',
        width: '90%',
    },
    list: {
        paddingTop: 15,
        paddingBottom: 10
    },
    input: {
        marginHorizontal: 30,
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000',
        fontFamily: Fonts.book,
    }
})

export default LeaveScreen;