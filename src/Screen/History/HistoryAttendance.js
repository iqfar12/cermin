import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import SubHeader from '../../Component/SubHeader';
import Icon from '@expo/vector-icons/MaterialIcons'
import moment from 'moment';

const RightComponent = ({ navigation }) => {
    return (
        <View
            style={styles.right}
        >
            <Text style={styles.rightTxt}>{moment(new Date()).format('DD/MM/YYYY')}</Text>
            <Icon name={'calendar-today'} size={25} color={'#FFF'} />
        </View>
    );
};

const DummyData = [
    {
        id: 0,
    },
    {
        id: 0,
    },
    {
        id: 0,
    },
    {
        id: 0,
    },
    {
        id: 0,
    },
    {
        id: 0,
    },
    {
        id: 0,
    },
]

const HistoryAttendance = () => {
    const navigation = useNavigation();

    const renderListCard = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Detail History Attendance', {data: item})} style={styles.card}>
                <View style={styles.top}>
                    <Text style={styles.name}>3121901993200001<Text style={styles.nik}> | John Doe</Text></Text>
                    <Icon name={'radio-button-unchecked'} size={25} color={'#FFB81C'} />
                </View>
                <View style={styles.subTop}>
                    <View style={styles.location}>
                        <Icon name={'location-pin'} size={25} color={'#C5C5C5'} />
                        <Text style={styles.locationTxt}>4213B</Text>
                    </View>
                    <View style={styles.nameContainer}>
                        <Icon name={'assignment-ind'} size={25} color={'#BABCBE'} />
                        <Text style={styles.nik}>John Doe</Text>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.stateContainer}>
                        <View style={styles.state}>
                            <Text style={styles.stateTitle}>Masuk</Text>
                            <Text style={styles.stateTime}>08:15</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Attendance Out')} style={styles.stateButtonLogout}>
                            <Icon name={'logout'} size={25} color={'#FFF'} />
                            <Text style={styles.stateButtonTxt}>Pulang</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Attendance Rest')} style={styles.stateButtonRest}>
                            <Icon name={'local-cafe'} size={25} color={'#FFF'} />
                            <Text style={styles.stateButtonTxt}>Istirahat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Leave')} style={styles.stateButtonAgenda}>
                            <Icon name={'article'} size={25} color={'#FFF'} />
                            <Text style={styles.stateButtonTxt}>Izin</Text>
                        </TouchableOpacity>
                    </View>
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
                    <Text style={styles.headerTitle}>Jumlah Absen (38<Text style={{ color: '#C5C5C5', fontFamily: Fonts.book }}>/100</Text>)</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.search}>
                        <Icon name={'search'} size={25} color={'#C5C5C5'} />
                        <TextInput style={styles.input} placeholder={'Cari Nama/Nik'} />
                    </View>
                    <View style={styles.tagContainer}>
                        <TouchableOpacity style={styles.more}>
                            <Icon name={'tune'} size={25} color={'#000'} />
                        </TouchableOpacity>
                        <View style={styles.tag}>
                            <Text style={styles.tagTitle}>Absen Lengkap</Text>
                            <Icon name={'cancel'} size={20} color={'#FFF'} />
                        </View>
                    </View>
                    <FlatList
                        data={DummyData}
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
        padding: 8,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        marginRight: 5,
        width: '25%',
    },
    stateButtonRest: {
        backgroundColor: '#FFB81C',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        marginRight: 5,
        width: '25%'
    },
    stateButtonAgenda: {
        backgroundColor: '#423FDA',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        marginRight: 5,
        width: '25%',
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
    }
})
