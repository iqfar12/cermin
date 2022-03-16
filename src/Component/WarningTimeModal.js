import React from 'react'
import { StyleSheet, Text, View, Modal, Image, TouchableOpacity } from 'react-native'
import { Warning, ic_batas_waktu } from '../assets'
import { Fonts } from '../Utils/Fonts'
import SubmitButton from './SubmitButton'

const WarningTimeModal = ({visible, onPress}) => {
    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.logo}>
                        <Image style={styles.image} source={ic_batas_waktu} />
                    </View>
                    <Text style={styles.title}>Peringatan!</Text>
                    <Text style={styles.content}>
                        Untuk bisa absen harap ubah settingan waktu pada device anda menjadi otomatis
                    </Text>
                    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.button}>
                        <Text style={styles.buttonTitle}>Oke</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default WarningTimeModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    wrapper: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 25,
    },
    logo: {
        width: '30%',
        height: undefined,
        aspectRatio: 1 / 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        color: '#DC1B0F',
        paddingVertical: 10,
    },
    content: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: '#383636',
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    button: {
        backgroundColor: '#195FBA',
        width: '70%',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 20,
    },
    buttonTitle: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#FFF',
    }
})
