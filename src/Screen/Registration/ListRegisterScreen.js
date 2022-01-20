import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Utils/Fonts';
import SubHeader from '../../Component/SubHeader';
import Icon from '@expo/vector-icons/MaterialIcons'

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
    return (
        <>
            <SubHeader
                right={<RightComponent navigation={navigation} />}
                onBack={() => navigation.goBack()}
                title={'Batalkan'}
            />
            <View style={styles.container}>
                <Text>List Register</Text>
            </View>
        </>
    )
}

export default ListRegisterScreen

const styles = StyleSheet.create({
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
})
