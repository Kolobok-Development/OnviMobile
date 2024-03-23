import { useTheme } from "@context/ThemeProvider";
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { horizontalScale, moderateScale, verticalScale } from "../../../utils/metrics";
import { Platform } from 'react-native';
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
const About = () => {
    const navigation: any = useNavigation()

    return (
        <>
        <GHScrollView contentContainerStyle={{ flexGrow: 1, ...styles.container}} nestedScrollEnabled={true}>
            <View style={{alignSelf: 'flex-start', paddingBottom: verticalScale(15), paddingLeft: horizontalScale(15), paddingTop: verticalScale(15)}}>
                <TouchableOpacity style={{display: "flex", justifyContent: "center", paddingLeft: horizontalScale(15)}} onPress={() =>  navigation.goBack()}>
                    <Image source={require("../../../assets/icons/close.png")} style={{width: horizontalScale(22), height: verticalScale(22), alignSelf: "flex-start", resizeMode: 'contain'}} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '90%', height: '55%', borderRadius: moderateScale(27), display: "flex", justifyContent: "flex-start", flexDirection: "column" }}>
            <View style={{alignSelf: 'center', paddingBottom: verticalScale(15)}}>
                <Image
                    source={require('../../../assets/icons/onvi_log_black_green.png')}
                    style={{
                        width: horizontalScale(91),
                        height: verticalScale(51),
                        resizeMode: 'contain',
                        alignItems: "center"
                    }}
                />
            </View>
                <Text
                    style={{
                        ...styles.text,
                        alignSelf: "center",
                        paddingBottom: verticalScale(15)
                    }}
                >onvi</Text>
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: verticalScale(15)
                    }}
                >
                    <Text style={{ ...styles.header}}>Версия приложения</Text>
                    <Text style={{ ...styles.text}}>1.0.0</Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: verticalScale(15)
                    }}
                >
                    <Text style={{ ...styles.header}}>Версия операционной системы</Text>
                    <Text style={{ ...styles.text}}>{`${Platform.OS} ${Platform.Version}`}</Text>
                </View>

                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: verticalScale(40)
                    }}
                >
                    <Text style={{ ...styles.header}}>Регион</Text>
                    <Text style={{ ...styles.text}}>Россия</Text>
                </View>
                <TouchableOpacity style={{alignItems: "center"}}>
                    <Text style={{ ...styles.text}}>Написать в поддержку</Text>
                </TouchableOpacity>
            </View>
        </GHScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 22,
        alignItems: 'center'
    },
    header: {
        color: '#000000',
        fontSize: moderateScale(10),
        fontWeight: "400",
    },
    text: {
        color: '#000000',
        fontSize: moderateScale(16),
        fontWeight: "500",
    }
})

export { About };