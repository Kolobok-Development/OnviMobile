import React from 'react';
import { View, Image } from 'react-native';


const Icon = () => {
    return (
        <View>
            <Image source={require('../../assets/avatar.jpg')} />
        </View>
    )
}



export { Icon };