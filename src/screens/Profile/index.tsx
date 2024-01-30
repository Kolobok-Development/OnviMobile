import React, { useEffect } from 'react';

import { View, Text } from 'react-native';

import { useUpdate, useStateSelector } from '@context/AppContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Profile = () => {

    const updateValue = useUpdate();

    const value = useStateSelector((state) => state.value);

    useEffect(() => {
        console.log("value: ", value)
    }, [value])

    // updateValue({
    //     businesses: [
    //         {
    //           lat: 55.71070,
    //           long: 37.2,
    //           id: '1',
    //           address: 'King Street, 9'
    //         },
    //         {
    //           lat: 55.71,
    //           long: 37.8,
    //           id: '1',
    //           address: 'King Street, 9'
    //         },
    //         {
    //           lat: 55.65,
    //           long: 37.61556,
    //           id: '1',
    //           address: 'King Street, 9'
    //         },
    //         {
    //           lat: 55.60,
    //           long: 37.85,
    //           id: '1',
    //           address: 'King Street, 9'
    //         },
    //       ]

    return (
    <>
    {value &&  <View>
                <Text>Profile</Text>
                <TouchableOpacity style={{width: 100, height: 100, backgroundColor: 'red'}} onPress={() => {
                    updateValue({
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