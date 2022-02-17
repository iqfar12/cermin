import React from "react";
import { Modal, View, ScrollView, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Fonts } from '../Utils/Fonts';

const showScreen = (Data, visible, setCheck) => {
    return (
        <Modal visible={visible} transparent statusBarTranslucent={true} >
            <ScrollView contentContainerStyle={styles.ContainerScroll}>
                <View style={styles.Container}>
                    <View style={styles.TitleContainer}>
                        <Text style={styles.TitleIndicator}>Pilih indikator</Text>
                        <Text style={styles.TitleCancel}>Batal Pilih (2) </Text>
                    </View>
                    <View>
                        {Data.map((item, id) => (
                            <View key={id}>
                                <TouchableOpacity onPress={setCheck} >
                                    <View style={styles.ContainerTouch}>
                                        <View style={styles.LeftContent}>
                                            <Text style={styles.NumberContent}>{item.no}</Text>
                                            {item.no ?
                                                <Text style={styles.SeparatorContent}>|</Text> : null
                                            }
                                            <Text style={styles.Content}>{item.names}</Text>
                                        </View>
                                        {check ?
                                            <View style={styles.IconContainer}>
                                                <MaterialIcons name="checkbox-marked" size={20} color='#00ABF5' />
                                            </View>
                                            :
                                            <View style={styles.nullContainer} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={styles.ContainerButton}>
                        <TouchableOpacity>
                            <Text style={styles.ButtonTitle}>Selesai</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    )
};

export default showScreen;

const styles = StyleSheet.create({
    ContainerScroll: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    Container: {
        flex: .71,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: '#FFF'
    },
    TitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8EA'
    },
    TitleIndicator: { fontFamily: Fonts.bold },
    TitleCancel: {
        fontFamily: Fonts.bold,
        color: '#00ABF5'
    },
    ContainerTouch: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8EA'
    },
    LeftContent: {
        flexDirection: 'row',
        width: '60%',
    },
    NumberContent: {
        fontFamily: Fonts.bold,
        color: '#748389',
        paddingLeft: item.no ? 30 : 30,
        paddingRight: item.no ? 10 : 0,
        textAlign: 'left'
    },
    SeparatorContent: { color: '#748389' },
    Content: {
        fontFamily: Fonts.book,
        color: '#748389',
        paddingLeft: item.no ? 10 : 0
    },
    IconContainer: {
        width: '30%',
        alignItems: 'flex-end'
    },
    nullContainer: { alignItems: 'flex-end' },
    ContainerButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E1E8EA',
    },
    ButtonTitle: {
        fontFamily: Fonts.bold,
        color: '#00ABF5',
    }
})