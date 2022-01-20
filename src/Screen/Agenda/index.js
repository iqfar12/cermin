import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons'

// Header
import SubHeader from '../../Component/SubHeader';

// Font
import { Fonts } from '../../Utils/Fonts';


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

const LeaveScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
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
                <TouchableOpacity style={styles.TouchAccount}>
                    <Icon name="person" size={24} color="#C5C5C5" />
                    <View style={styles.ContentContainer}>
                        <Text style={styles.TextContent}>321312321321 <Text style={styles.TextSubContent}>| John Doe</Text></Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
            </View>
            <View style={styles.ContainerLeaveType}>
                <Text style={styles.LeaveTitle}>Lokasi</Text>
                <TouchableOpacity style={styles.LeaveContent}>
                    <Icon name="location-pin" size={24} color="#C5C5C5" />
                    <View style={styles.ContainerTextLeave}>
                        <Text style={styles.TextLeave}>4213B</Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
                <Text style={styles.LeaveTitle}>Jenis Izin</Text>
                <TouchableOpacity style={styles.LeaveContent}>
                    <View style={styles.ContainerTextLeave}>
                        <Text style={styles.TextLeave}>Absen Masuk</Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
                <Text style={styles.LeaveTitle}>Keterangan</Text>
                <TouchableOpacity style={styles.LeaveContent}>
                    <View style={styles.ContainerTextLeave}>
                        <Text style={styles.TextLeave}>Sakit Perut</Text>
                    </View>
                    <Icon name="arrow-drop-down" size={24} color="#6C6C6C" />
                </TouchableOpacity>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity style={styles.TouchButton}>
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
        justifyContent: 'center'
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
        marginHorizontal: 40,
        paddingVertical: 13,
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
    }
})

export default LeaveScreen;