import { BLACK } from '../../utils/colors';
import React, { useState } from 'react';

import {TouchableOpacity, StyleSheet, Text, Image, View, Dimensions, Platform} from 'react-native';

import { NotificationCircle } from '@components/NotificationCircle';

import { navigateBottomSheet } from '@navigators/BottomSheetStack';

import { dp } from '../../utils/dp'

import { useTheme } from '@context/ThemeProvider';
import { useAuth } from '@context/AuthContext';

const height = dp(Dimensions.get('screen').height);

interface BalanceProps {
    bottomSheetIndex: number;
    bottomSheetRef: any
}

const Balance = ({ bottomSheetIndex, bottomSheetRef } : BalanceProps) => {
    const { theme }: any = useTheme()

    const { user }: any = useAuth()

    return (
        <View style={[styles.container, Platform.OS === 'android' && styles.androidShadow,
            Platform.OS === 'ios' && styles.iosShadow]}>
            <TouchableOpacity style={{...styles.button, display: bottomSheetIndex > 2 ? "none" : "flex", backgroundColor: theme.mainColor}} onPress={() => {
                navigateBottomSheet("History", {})
                bottomSheetRef.current?.snapToPosition("95%")
            }}>
                <Image source={require("../../assets/icons/small-icon.png")} style={{width: dp(30), height: dp(30)}} />
                <Text style={{...styles.balance, color: theme.textColor}}>{user && user.cards && user.cards.balance ? user.cards.balance : 0}</Text>
                <NotificationCircle number={4} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: dp(40),
        backgroundColor: BLACK,
        position: 'absolute',
        top: dp(10),
        paddingLeft: dp(6),
        paddingRight: dp(6),
        marginLeft: dp(4),
        marginRight: dp(4),
        right: dp(10),
        borderRadius: 45,
        padding: dp(5),
        shadowColor: '#494949',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        justifyContent: "space-between",
        alignItems: 'center',
        flexDirection: 'row',
    },
    balance: {
        color: '#FFFFFF',
        fontSize: dp(18),
        paddingRight: dp(5),
        fontWeight: '600',
        display: 'flex',
        flexDirection: 'row'
    },
    container: {
        position: "relative",
        flexDirection: 'row'
    },
    androidShadow: {
        elevation: 4, // Add elevation for Android shadow
    },
    iosShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

export { Balance };
