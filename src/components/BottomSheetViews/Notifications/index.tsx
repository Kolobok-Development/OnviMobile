import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Button } from '@styled/buttons';

const Notifications = () => {

    const navigation: any = useNavigation();

    return (
        <View style={styles.container}>
            <Button 
                label="История"
                onClick={() => {}}
                color='blue'
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
