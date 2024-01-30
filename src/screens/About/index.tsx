import {Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {dp} from "../../utils/dp";
import {BurgerButton} from "@navigators/BurgerButton";
import React from "react";

const About = () => {

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <BurgerButton visible={true} />
                </View>
                <View style={styles.content}>
                        <Image
                            source={require('../../assets/icons/onvi_log_black_green.png')}
                            style={styles.logo}
                        />
                        <Text style={{ ...styles.title}}>Onvi</Text>
                    <View style={styles.section}>
                        <Text style={{ ...styles.sectionTitle}}>Версия приложения</Text>
                        <Text style={{ ...styles.text}}>1.0.0</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={{ ...styles.sectionTitle}}>Версия операционной системы</Text>
                        <Text style={{ ...styles.text}}>{`${Platform.OS} ${Platform.Version}`}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={{ ...styles.sectionTitle}}>Регион</Text>
                        <Text style={{ ...styles.text}}>Россия</Text>
                    </View>
                </View>
                <TouchableOpacity style={{alignItems: "center"}} onPress={() => Linking.openURL('https://t.me/adamsbear34')}>
                    <Text style={{ ...styles.title}}>Написать в поддержку</Text>
                </TouchableOpacity>
            </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: dp(16),
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    header: {
        alignSelf: 'flex-start',
    },
    content: {
        marginTop: dp(70),
        height: '80%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    logo: {
        width: dp(91),
        height: dp(51),
        resizeMode: 'contain',
    },
    section: {
        alignItems: 'center',
        paddingBottom: dp(15)
    },
    title: {
        color: '#000000',
        fontSize: dp(18),
        fontWeight: '500'
    },
    text: {
        color: '#000000',
        fontSize: dp(10),
        fontWeight: '400'
    },
    sectionTitle: {
        color: '#000000',
        fontSize: dp(16),
        fontWeight: '600'
    }

});
export { About }