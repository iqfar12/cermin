import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import SubHeader from '../../Component/SubHeader';
import Icon from '@expo/vector-icons/MaterialIcons'
import TaskServices from '../../Database/TaskServices';

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

const HistoryAgenda = () => {
    const navigation = useNavigation();
    const MasterAttendance = TaskServices.getAllData('TR_ATTENDANCE');
    const MasterEmployee = TaskServices.getAllData('TM_EMPLOYEE');
    const MasterAbsenceCode = TaskServices.getAllData('TM_ABSENCE_TYPE')
    const [search, setSearch] = useState('');

    const ListAgenda = useMemo(() => {
        const res = MasterAttendance.filter((item) => item.TYPE === '4')
        if (search !== '') {
            return res.filter((item) => item.EMPLOYEE_FULLNAME.toLowerCase().includes(search.toLowerCase()) || item.EMPLOYEE_NIK.toLowerCase().includes(search.toLowerCase()))
        } else {
            return res
        }
    }, [MasterAttendance, search])

    const renderListCard = ({ item, index }) => {
        const user = MasterEmployee.find((data) => data.ID == item.EMPLOYEE_ID)
        const type = MasterAbsenceCode.find((data) => data.CODE == item.ABSENCE_CODE)?.DESCRIPTION
        return (
            <View style={styles.card}>
                <View style={styles.topCard}>
                    <View style={styles.cardLeft}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}>{user?.EMPLOYEE_FULLNAME}</Text>
                        <Text style={styles.nik}>{user?.EMPLOYEE_NIK} </Text>
                    </View>
                    <View style={styles.cardRight}>
                        <View style={styles.location}>
                            <Icon name={'location-pin'} size={20} color={'#C5C5C5'} />
                            <Text style={styles.locationTxt}>{user?.WERKS}</Text>
                        </View>
                        <Icon name={item.SYNC_TIME !== null ? 'done' : 'radio-button-unchecked'} size={25} color={item.SYNC_TIME !== null ? '#195FBA' : '#FFB81C'} />
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.bottomComponent}>
                        <Text style={styles.title}>Tipe Ijin</Text>
                        <Text style={styles.txt} numberOfLines={4} ellipsizeMode={'tail'}>{type}</Text>
                    </View>
                    <View style={styles.bottomComponent}>
                        <Text style={styles.title}>Keterangan</Text>
                        <Text style={styles.txt} numberOfLines={4} ellipsizeMode={'tail'}>{item.DESCRIPTION}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <SubHeader
                onBack={() => navigation.goBack()}
                title={'Kembali'}
            />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Daftar Izin</Text>
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
                        data={ListAgenda}
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

export default HistoryAgenda

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
    topCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLeft: {
        borderRightWidth: 1,
        borderColor: '#C5C5C5',
        paddingRight: 50,
        marginRight: 20,
        maxWidth: '55%'
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
    },
    bottom: {
        marginTop: 10, 
        borderColor: '#C5C5C5',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomComponent: {
        paddingTop: 10,
        width: '50%',
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.bold,
        color: '#000',
        paddingBottom: 5,
    },
    txt: {
        fontFamily: Fonts.book,
        color: '#6C6C6C',
        fontSize: 12,
    }
})
