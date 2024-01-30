import React, { useState } from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';

// styled components
import { Card } from '@styled/cards';

import { useRoute, useNavigation } from '@react-navigation/native';

import { dp } from '../../../utils/dp';

import { navigateBottomSheet } from '@navigators/BottomSheetStack';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useStateSelector } from '@context/AppContext';

import { useUpdate } from '@context/AppContext';
import { BackButton } from '@components/BackButton';

const height = dp(Dimensions.get('screen').height);
const MID_TRANSLATE_Y = -height / 1.5 + dp(50)

const Business = ({ bottomSheetRef } : any) => {
    const route: any = useRoute()
    const navigation: any = useNavigation()

    const updateValue = useUpdate();
    const order = useStateSelector((state: any) => state.order);


    const selectCarwash = (carwash: any) => {
        updateValue({
            order: {
                ...order,
                id: carwash.id,
                type: carwash.type,
                prices: carwash.price
            }
        })

        navigateBottomSheet('BusinessInfo', carwash)
        route.params.bottomSheetRef.current?.snapToPosition("60%")

    }


    return (
        <View style={styles.container}>
            <Card>
                {route.params.carwashes.map((carwash: any, index: number) => {
                    return (
                        <View style={styles.button} key={"carwash-" + index}>
                            <View style={{
                                flex: 1,
                            }}>
                                <Image source={require("../../../assets/icons/small-icon.png")} style={styles.circleImage} />
                            </View>
                            <View style={{flex: 5}}>
                            <TouchableOpacity onPress={() => selectCarwash(carwash)}>
                                <Text style={styles.title}>{carwash.name}</Text>
                                <Text style={styles.text}>{carwash.address}</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    )})
                }
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: dp(10) }}>
                    <BackButton index={2} />
                </View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get("screen").height,
    },
    button: {
        backgroundColor: "#F5F5F5",
        height: dp(70),
        display: "flex",
        borderRadius: 22,
        padding: dp(14),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: dp(5)
    },
    title: {
        fontSize: dp(16),
        fontWeight: '600',
        lineHeight: dp(20),
        color: '#000'
    },
    text: {
        fontSize: dp(16),
        fontWeight: '400',
        lineHeight: dp(20),
        color: '#000'
    },
    circleImage: {
        width: dp(39),
        height: dp(39)
    }
})

export { Business };
