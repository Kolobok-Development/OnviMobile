import React from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';

// styled components
import { Card } from '@styled/cards';

import { useNavigation } from '@react-navigation/native';

import { dp } from '../../../utils/dp';

import { navigateBottomSheet } from '@navigators/BottomSheetStack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '@styled/buttons';

const Notifications = () => {

    const navigation: any = useNavigation();

    return (
        <View style={styles.container}>
            <Button 
                label="История"
                onClick={() => {}}
                color='blue'
                // width,
                // height,
                // fontSize,
                // fontWeight
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        height: Dimensions.get("screen").height,
    },
})

export { Notifications };
