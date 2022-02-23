import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import SubHeader from '../../Component/SubHeader';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import moment from 'moment';
import Icon from '@expo/vector-icons/MaterialIcons';
import TaskServices from '../../Database/TaskServices';

const DetailHistoryAttendance = ({route}) => {
    const {id} = route.params;
    const navigation = useNavigation();
    const [menu, setMenu] = useState(0);
    const Employee = TaskServices.getAllData('TM_EMPLOYEE')
    const MasterAttendance = TaskServices.getAllData('TR_ATTENDANCE');

    const Karyawan = useMemo(() => {
        return Employee.find((item) => item.ID == id);
    }, [Employee])

    const ListAttendance = useMemo(() => {
        return MasterAttendance.filter((item) => item.EMPLOYEE_ID == id);
    }, [MasterAttendance])

    const renderListCard = ({ item, index }) => {
        const type = () => {
            if (item.TYPE == '1') {
                return 'login'
            } else if (item.TYPE == '2') {
                return 'local-cafe'
            } else if (item.TYPE == '3') {
                return 'logout'
            } else {
                return `article`
            }
        }
        const color = () => {
            if (item.TYPE == '1') {
                return '#3D9F70'
            } else if (item.TYPE == '2') {
                return '#FFB81C'
            } else if (item.TYPE == '3') {
                return '#DC1B0F'
            } else {
                return '#423FDA'
            }
        }
        return (
            <View style={styles.card}>
                <Text style={styles.time}>{moment(item.INSERT_TIME).format('HH:mm')}</Text>
                <Icon name={type()} size={30} color={color()} />
                <Text style={styles.text}>{item.DESCRIPTION}</Text>
            </View>
        );
    };

    return (
        <>
            <SubHeader title={'Kembali'} onBack={() => navigation.goBack()} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{Karyawan?.EMPLOYEE_NIK}</Text>
                <View style={styles.SubHeaderContainer}>
                    <Icon name={'location-pin'} size={25} color={'#FFF'} />
                    <Text style={styles.location}>{Karyawan?.AFD_CODE}</Text>
                    <Text style={styles.nameHeader}>{Karyawan?.EMPLOYEE_FULLNAME}</Text>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.body}>
                    <Text style={styles.date}>
                        {'Riwayat'}
                    </Text>
                    <View style={styles.content}>
                        <View style={styles.bar} />
                        <FlatList
                            data={ListAttendance}
                            renderItem={renderListCard}
                            keyExtractor={(_, i) => i.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.list}
                            ListEmptyComponent={<Text style={styles.empty}>Empty</Text>}
                        />
                    </View>
                </View>
            </View>
        </>
    );
};

export default DetailHistoryAttendance;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    header: {
        borderTopWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: '#195FBA',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    topTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#005BB3',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabTitle: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#FFF',
    },
    selectedTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F2F2',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 12,
    },
    selectedTabTitle: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#6C6C6C',
    },
    date: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#6C6C6C',
        paddingVertical: 14,
    },
    body: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        elevation: 0.5,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    topCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#D7E6F9',
        borderWidth: 1,
        borderColor: '#6DA9F6',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    bottomCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nik: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#6C6C6C',
    },
    name: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#6C6C6C',
        width: '55%'
    },
    list: {
        paddingBottom: 100,
    },
    empty: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        color: '#000',
        textAlign: 'center',
        paddingVertical: 10,
    },
    SubHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },
    location: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#FFF',
        borderRightWidth: 1,
        borderColor: '#FFF',
        paddingRight: 10,
        marginRight: 10,
    },
    nameHeader: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#FFF',
    },
    time: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#000',
        marginRight: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#5F6368',
        marginLeft: 10,
    },
    bar: {
        width: '1%',
        height: '100%',
        backgroundColor: '#C5C5C5',
        borderRadius: 10,
        marginRight: 20,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});
