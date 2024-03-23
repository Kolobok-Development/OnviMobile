import React from 'react';

import { View, Text } from 'react-native';

import { useAppState } from '@context/AppContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = () => {
    const { state, setState } = useAppState()
    return (
    <>
    {state.value &&  <View>
                <Text>Profile</Text>
                <TouchableOpacity style={{width: 100, height: 100, backgroundColor: 'red'}} onPress={() => {
                    setState({
                        ...state,
                        order: {
                            orderDate: (new Date()).toISOString,
                            sum: 100
                        }
                    })
                }} />
            </View>}
    </>
    )
}

export { Profile }