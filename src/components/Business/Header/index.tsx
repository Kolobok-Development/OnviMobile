import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'

import { useState } from "react"

import { useRoute } from '@react-navigation/native'

import { Button } from '@styled/buttons';

import { dp } from "../../../utils/dp"

import { Box } from "@components/Boxes/Box"

import { horizontalScale, moderateScale, verticalScale } from "../../../utils/metrics";

interface BusinessHeader {
    navigation: any
    type?: "navigate" | "empty" | "box"
    box?: number
    callback?: () => void
    position?: string
}

const BusinessHeader = ({ navigation, type, box, callback, position } : BusinessHeader) => {

    const route: any = useRoute()

    const makeAYandexRoute = () => {
        /*
        const url = `yandexnavi://build_route_on_map?lat_to=${String(route.params.location.lat)}&lon_to=${String(route.params.location.lon)}`;
        const key = 'a357185e-8ab9-4f04-b3b0-b26c56871365';
        const client = 'SavniKamos77';

        sign(url, client, key)
        .then((signedUrl) => {
          Linking.openURL(signedUrl);
        })
        .catch((error) => {
          // open without sinature
          setModalVisible(false)
          Linking.openURL(url);
          Toast.show({
            type: 'error',
            text1: 'Не получилось построить маршрут!',
          });
        });

         */
    }

    const [modalVisible, setModalVisible] = useState(false);

    const rightItem = () => {
        switch (type) {
            case "empty":
                return <></>
            case "navigate":
                return <View style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-end',

                }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image source={require("../../../assets/icons/routeIcon.png")} style={styles.circleImage} />
                    </TouchableOpacity>
                </View>
            case "box":
                return <View style={{
                }}>
                    <Box label={box ? String(box) : ""} onClick={() => {}} disabled={false} active={true}
                        width={horizontalScale(72)}
                        height={verticalScale(72)}
                        borderRadius={moderateScale(21)}
                        labelStyles={{
                            fontSize: moderateScale(34),
                            fontWeight: '600',
                            color: '#000000'
                        }}
                    />
                </View>
            default:
                return <></>
        }
    }

    return <>
        <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(true)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>

                        <Image source={require("../../../assets/emojies/car.png")} style={styles.carImage} />

                        <Text style={styles.modalTitle}>Построить маршрут</Text>

                        <View style={styles.actionButtons}>
                            <Button onClick={makeAYandexRoute} label="Яндекс" color="blue" height={50} fontSize={18} fontWeight="600" />
                        </View>

                        <View style={styles.actionButtons}>
                            <Button onClick={() => setModalVisible(false)} label="Назад" color="blue" height={50} fontSize={18} fontWeight="600" />
                        </View>
                    </View>
                </View>
            </Modal>
        <View style={styles.header}>
            {/* <View style={{paddingRight: dp(10)}}>
                <BackButton callback={callback} position={position} />
            </View> */}
            <View style={{flex: 5}}>
                <Text style={styles.title}>{route.params.name}</Text>
                <Text style={styles.text}>{route.params.address}</Text>
            </View>
            <View style={{flex: type === "box" ? 2 : 1}}>
                {rightItem()}
            </View>
        </View>
    </>
}

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: verticalScale(25),
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight: '500',
        paddingBottom: verticalScale(5),
        overflowWrap: "normal",
        color: '#000'
    },
    text: {
        fontSize: moderateScale(14),
        fontWeight: '300',
        overflowWrap: "break-word",
        color: '#000'
    },
    circleImage: {
        width: dp(45),
        height: dp(45),
        resizeMode: 'contain'
    },


    /**/
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 38,
        width: dp(341),
        height: dp(222),
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center"
    },
    modalTitle: {
        fontWeight: "600",
        fontSize: dp(20),
        paddingBottom: dp(3)
    },
    modalText: {
        fontWeight: "400",
        fontSize: dp(16)
    },
    actionButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: dp(10)
    },
    carImage: {
        width: dp(25),
        height: dp(25)
    }
})

export { BusinessHeader }
