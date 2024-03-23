import React, { useState } from 'react';

import { dp } from "../../utils/dp"

import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {BurgerButton} from "@navigators/BurgerButton";

// import { Button } from '@styled/buttons';

const promos = [
    {
        id: 1,
        img: "../../assets/coupon.png",
    }
]


const Promos = () => {
    const [search, setSearch] = useState("")

    const [modalVisible, setModalVisible] = useState(false);

    // const navigation: any = useNavigation();

    const modalCallback = () => {
        setModalVisible(true)
    }

    const forceForward = () => {
        setModalVisible(false)
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BurgerButton isDrawerStack={true} />
                    <Text style={styles.screenTitle}>Промокод и Скидки</Text>
                </View>
                <View style={styles.content}>
                    <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>Ввести промокод</Text>
                    <TextInput
                        placeholder='Промокод'
                        keyboardType="numeric"
                        maxLength={19}
                        value={search}
                        onChangeText={setSearch}
                        style={{ backgroundColor: "rgba(245, 245, 245, 1)", borderRadius: 25, width: "100%", height: 40, paddingLeft: dp(20), textAlign: 'left', fontSize: 16, color: "#000000", marginTop: dp(20) }}
                    />
                    </View>
                    <View style={styles.cuponContainer}>
                        <Text style={styles.sectionTitle}>Промокод и Скидки</Text>
                        <Text style={{ fontWeight: "600", fontSize: dp(20), marginTop: dp(50), color: '#000' }}>Купоны</Text>
                        <View style={{display: "flex", flexDirection: "column", marginTop: dp(25)}}>
                            {promos.map((promo: any) => {
                                return <TouchableOpacity onPress={() => modalCallback()}><Image key={promo.id} source={require("../../assets/coupon.png")} style={{width: "100%", height: dp(120), resizeMode: 'contain' }} /></TouchableOpacity>
                            })}
                        </View>
                    </View>
                </View>
                {
                    /*
                <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisible(true)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontWeight: "600", fontSize: dp(24), paddingBottom: dp(24) }}>15% скидка на мойку</Text>

                            <Image source={require("../../assets/emojies/smile.png")} style={styles.circleImage} />

                            <View style={{ display: "flex", flexDirection: "row", marginTop: dp(14), alignItems: "center" }}>
                                <Text style={{ fontWeight: "600", fontSize: dp(24), color: "rgba(52, 97, 255, 1)" }}>DGFYUE6098</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}><Image source={require("../../assets/icons/Copy.png")} style={styles.copyImage} /></TouchableOpacity>
                            </View>

                            <View style={{justifyContent: "center", paddingLeft: dp(20), paddingRight: dp(20)}}>
                                <Text style={styles.modalText}>Промокод действует</Text>
                            </View>
                            <View style={{justifyContent: "center", paddingLeft: dp(20), paddingRight: dp(20)}}>
                            <Text style={styles.modalText}>на покупку от 200 р.</Text>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", marginTop: dp(24), alignItems: "center", backgroundColor: 'rgba(245, 245, 245, 1)', paddingTop: dp(4), paddingRight: dp(10), paddingBottom: dp(5), paddingLeft: dp(10), borderRadius: dp(69)  }}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}><Image source={require("../../assets/icons/finger.png")} style={styles.copyImage} /></TouchableOpacity>
                                <Text style={{ fontWeight: "600", fontSize: dp(12), paddingLeft: dp(5) }}>подробнее</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

                     */
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: dp(16),
        flexDirection: 'column',
        backgroundColor: '#FFF'
    },
    header: {
        flexDirection: 'row',
        textAlign: 'center',
        marginTop: dp(20)
    },
    screenTitle: {
        fontWeight: "600",
        fontSize: dp(24),
        marginLeft: dp(15),
        textAlignVertical: 'center',
        color: '#000'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        marginTop: dp(30),
    },
    sectionTitle: {
        fontSize: dp(22),
        color: '#000',
        fontWeight: '600'
    },
    cuponContainer: {
        flex: 3,
    },
     modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: dp(20),
        borderRadius: 38,
        width: dp(341),
        height: dp(309),
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center"
    },
    modalTitle: {
        fontWeight: "600",
        fontSize: dp(24),
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
        paddingTop: dp(27)
    },
    circleImage: {
        width: dp(45),
        height: dp(45)
    },
    copyImage: {
        width: dp(24),
        height: dp(24)
    }
})

export { Promos }
