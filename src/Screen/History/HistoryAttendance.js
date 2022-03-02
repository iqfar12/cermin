import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import SubHeader from '../../Component/SubHeader';
import Icon from '@expo/vector-icons/MaterialIcons'
import moment from 'moment';
import TaskServices from '../../Database/TaskServices';
import { dateConverter } from '../../Utils/DateConverter';
import DateTimePicker from '@react-native-community/datetimepicker';

const RightComponent = ({ onPress, date }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.right}>
            <Text style={styles.rightTxt}>{moment(date).format('DD/MM/YYYY')}</Text>
            <Icon name={'calendar-today'} size={25} color={'#FFF'} />
        </TouchableOpacity>
    );
};

const HistoryAttendance = () => {
    const navigation = useNavigation();
    const MasterAttendance = TaskServices.getAllData('TR_ATTENDANCE');
    const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
    const [search, setSearch] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const user = TaskServices.getCurrentUser();
    const isFocused = useIsFocused();

    const ListAttendance = useMemo(() => {
        const location = user.LOCATION.split(',');
        const res = MasterAttendance.map((item) => {
            const users = MasterEmployee.find((data) => data.ID == item.EMPLOYEE_ID);
            item.name = users.EMPLOYEE_FULLNAME
            item.nik = users.EMPLOYEE_NIK
            if (user.REFERENCE_LOCATION == 'AFD') {
                item.location = users.AFD_CODE;
            } else if (user.REFERENCE_LOCATION == 'BA') {
                item.location = users.WERKS
            } else if (user.REFERENCE_LOCATION == 'COMP') {
                item.location = users.COMP_CODE
            }
            return item
        }).filter((item) => {
            const absenDate = dateConverter(item.DATETIME);
            const dateNow = dateConverter(date);
            return absenDate === dateNow
        })
        let data = res;
        if (user.REFERENCE_LOCATION == 'AFD') {
            data = res.filter((item) => location.includes(item.location))
        } else if (user.REFERENCE_LOCATION == 'BA') {
            data = res.filter((item) => location.includes(item.location?.substr(0, 4)))
        } else if (user.REFERENCE_LOCATION == 'COMP') {
            data = res.filter((item) => location.includes(item.location?.substr(0, 2)))
        } else {
            // TODO: HO Need Filter!!
            data = res
        }
        if (search !== '') {
            return data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.nik.toLowerCase().includes(search.toLowerCase()))
        }
        return data
    }, [MasterAttendance, search, date, isFocused])

    const GroupingListMember = useMemo(() => {
        const group = ListAttendance.reduce(function (r, a) {
            r[a.EMPLOYEE_ID] = r[a.EMPLOYEE_ID] || [];
            r[a.EMPLOYEE_ID].push(a);
            return r;
        }, Object.create(null));
        const res = Object.values(group).map((item) => {
            const attendanceIn = item.find((item) => item.TYPE == '1');
            const attendanceOut = item.find((item) => item.TYPE == '3');
            const rest = item.find((item) => item.TYPE == '2');
            const agenda = item.find((item) => item.TYPE == '4');

            let insertTime = new Date();
            if (attendanceIn !== undefined) {
                insertTime = attendanceIn.INSERT_TIME
            }
            if (attendanceOut !== undefined) {
                insertTime = attendanceOut.INSERT_TIME
            }
            if (rest !== undefined) {
                insertTime = rest.INSERT_TIME
            }
            if (agenda !== undefined) {
                insertTime = agenda.INSERT_TIME
            }

            return {
                NAME: item[0].name,
                LOCATION: item[0].location,
                NIK: item[0].nik,
                EMPLOYEE_ID: item[0].EMPLOYEE_ID,
                ATTENDANCE_IN: attendanceIn !== undefined ? attendanceIn.INSERT_TIME : null,
                ATTENDANCE_OUT: attendanceOut !== undefined ? attendanceOut.INSERT_TIME : null,
                REST: rest !== undefined ? rest.INSERT_TIME : null,
                AGENDA: agenda !== undefined ? agenda.INSERT_TIME : null,
                INSERT_TIME: insertTime
            }
        });
        return res
    }, [ListAttendance]);

    const ListEmployee = useMemo(() => {
        const res = MasterEmployee.filter((item) => item.TYPE === 'E').filter((item) => item.REGISTER_STATUS == 'NONE');
        const location = user.LOCATION.split(',');
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

        return data;
    }, [MasterEmployee, user])

    const setRoute = async () => {
        const nav = {
            ID: 0,
            SOURCE: 'History Attendance'
        }

        await TaskServices.saveData('T_NAVIGATE', nav)
    }

    const renderListCard = ({ item, index }) => {
        // const user = MasterEmployee.find((data) => data.ID == item.EMPLOYEE_ID);
        // const type = () => {
        //     if (item.TYPE == '1') {
        //         return 'Masuk'
        //     } else if (item.TYPE == '2') {
        //         return 'Istirahat'
        //     } else if (item.TYPE == '3') {
        //         return 'Pulang'
        //     } else {
        //         return 'Izin'
        //     }
        // }
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Detail History Attendance', { id: item.EMPLOYEE_ID, date: item.INSERT_TIME })} style={styles.card}>
                <View style={styles.top}>
                    <Text style={styles.name}>{item.NIK}<Text style={styles.nik}> | {item.NAME}</Text></Text>
                    <Icon name={'radio-button-unchecked'} size={25} color={'#FFB81C'} />
                </View>
                <View style={styles.subTop}>
                    <View style={styles.location}>
                        <Icon name={'location-pin'} size={25} color={'#C5C5C5'} />
                        <Text style={styles.locationTxt}>{item.LOCATION}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                        <Icon name={'assignment-ind'} size={25} color={'#BABCBE'} />
                        <Text style={styles.nik}>{item.NAME}</Text>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.stateContainer}>
                        {item.ATTENDANCE_IN !== null &&
                            <View style={styles.state}>
                                <Text style={styles.stateTitle}>{'Masuk'}</Text>
                                <Text style={styles.stateTime}>{moment(item.ATTENDANCE_IN).format('HH:mm')}</Text>
                            </View>
                        }
                        {item.ATTENDANCE_OUT !== null &&
                            <View style={styles.state}>
                                <Text style={styles.stateTitle}>{'Pulang'}</Text>
                                <Text style={styles.stateTime}>{moment(item.ATTENDANCE_OUT).format('HH:mm')}</Text>
                            </View>
                        }
                        {item.REST !== null &&
                            <View style={styles.state}>
                                <Text style={styles.stateTitle}>{'Istirahat'}</Text>
                                <Text style={styles.stateTime}>{moment(item.REST).format('HH:mm')}</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.buttonContainer}>
                        {item.ATTENDANCE_IN === null &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                setRoute()
                                navigation.navigate('Take Picture Recognition')
                            }} style={styles.stateButtonLogout}>
                                <Icon name={'login'} size={25} color={'#FFF'} />
                                <Text style={styles.stateButtonTxt}>Masuk</Text>
                            </TouchableOpacity>
                        }
                        {item.ATTENDANCE_OUT === null &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                setRoute()
                                navigation.navigate('Attendance Out')
                            }} style={styles.stateButtonLogout}>
                                <Icon name={'logout'} size={25} color={'#FFF'} />
                                <Text style={styles.stateButtonTxt}>Pulang</Text>
                            </TouchableOpacity>
                        }
                        {item.REST === null &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                setRoute()
                                navigation.navigate('Attendance Rest')
                            }} style={styles.stateButtonRest}>
                                <Icon name={'local-cafe'} size={25} color={'#FFF'} />
                                <Text style={styles.stateButtonTxt}>Istirahat</Text>
                            </TouchableOpacity>
                        }
                        {item.AGENDA === null &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Leave')} style={styles.stateButtonAgenda}>
                                <Icon name={'article'} size={25} color={'#FFF'} />
                                <Text style={styles.stateButtonTxt}>Izin</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
    }

    return (
        <View style={styles.wrapper}>
            <SubHeader
                right={<RightComponent onPress={() => setShowDate(true)} date={date} />}
                onBack={() => navigation.goBack()}
                title={'Kembali'}
            />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Jumlah Absen ({GroupingListMember.length}<Text style={{ color: '#C5C5C5', fontFamily: Fonts.book }}>/{ListEmployee.length}</Text>)</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.search}>
                        <Icon name={'search'} size={25} color={'#C5C5C5'} />
                        <TextInput onChangeText={(val) => setSearch(val)} value={search} style={styles.input} placeholder={'Cari Nama/Nik'} />
                    </View>
                    {/* <View style={styles.tagContainer}>
                        <TouchableOpacity style={styles.more}>
                            <Icon name={'tune'} size={25} color={'#000'} />
                        </TouchableOpacity>
                        <View style={styles.tag}>
                            <Text style={styles.tagTitle}>Absen Lengkap</Text>
                            <Icon name={'cancel'} size={20} color={'#FFF'} />
                        </View>
                    </View> */}
                    <FlatList
                        data={GroupingListMember}
                        renderItem={renderListCard}
                        keyExtractor={(_, i) => i.toString()}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                    {showDate && (
                        <DateTimePicker
                            value={date}
                            mode={'date'}
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export default HistoryAttendance

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
        paddingRight: 50,
        marginRight: 20,
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
    },
    locationTxt: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#6C6C6C',
    },
    list: {
        paddingTop: 24,
        paddingBottom: 200,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    subTop: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#C5C5C5',
        paddingBottom: 10,
        marginBottom: 10,
    },
    stateTitle: {
        fontSize: 12,
        fontFamily: Fonts.book,
        color: '#5F6368',
    },
    stateTime: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#000000',
    },
    stateButtonLogout: {
        backgroundColor: '#DC1B0F',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        marginRight: 5,
        paddingHorizontal: 10,
    },
    stateButtonRest: {
        backgroundColor: '#FFB81C',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginRight: 5,
    },
    stateButtonAgenda: {
        backgroundColor: '#423FDA',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: 5,
        paddingHorizontal: 18,
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    state: {
        paddingRight: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    stateButtonTxt: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        color: '#FFF'
    },
    stateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})
