
import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { dp } from '../../../utils/dp';

import { OnviSwitch } from '@styled/buttons';
import { WHITE } from '../../../utils/colors';

import { ScrollView as GHScrollView } from 'react-native-gesture-handler';

import { useAxios } from '@hooks/useAxios';

import { useAuth } from '@context/AuthContext';

import { IAuthContext } from '@context/AuthContext/index.interface';
import {useNavigation, useRoute} from "@react-navigation/native";
import {horizontalScale, moderateScale, verticalScale} from "../../../utils/metrics";

const height = dp(Dimensions.get('screen').height);
const MID_TRANSLATE_Y = -height / 1.5 + dp(50)

const notifications = [
    {
        read: false,
        title: "Ваш личный промик",
        text: "Идейные соображения высшего порядка, а также рамки и место обучения кадро Идейные соображения высшего порядка, а также рамки и место обучения кадров",
        date: "17.05.2023"
    },
    {
        read: false,
        title: "Ваш личный промик",
        text: "Идейные соображения высшего порядка, а также рамки и место обучения кадро Идейные соображения высшего порядка, а также рамки и место обучения кадров",
        date: "17.05.2023"
    },
    {
        read: true,
        title: "Ваш личный промик",
        text: "Идейные соображения высшего порядка, а также рамки и место обучения кадро Идейные соображения высшего порядка, а также рамки и место обучения кадров",
        date: "17.05.2023"
    },
]

const balances = [
     {
        positive: false,
        title: "Мой-ка DS!",
        text: "г. Воронеж, ул. Брусилова 4е",
        date: "17.05.2023",
        rubles: -450,
        bonuses: -50
    },
    {
        positive: false,
        title: "Мой-ка DS!",
        text: "г. Воронеж, ул. Брусилова 4е",
        date: "17.05.2023",
        rubles: -450,
        bonuses: -50
    },
    {
        positive: true,
        title: "Мой-ка DS!",
        text: "г. Воронеж, ул. Брусилова 4е",
        date: "17.05.2023",
        rubles: 450,
        bonuses: 50
    },
]

const Settings = () => {
    const [user, setUser] = useState<any>(null)

    const api = useAxios("CORE_URL")
    const { signOut } = useAuth() as IAuthContext;

    const navigation: any = useNavigation()
    const route: any = useRoute();

    const updateInfo = async () => {
        // console.log("Wait")


        const data = await api.get("/account/me").then((data) => {
            // console.log(data.data.data.name)
            setUser(data.data.data)
        }).catch(err => console.log(err.response))
    }

    const onAboutAppHandle = () => {
     /*   route.params.bottomSheetRef.current.scrollTo(MID_TRANSLATE_Y)
        navigation.navigate("About", route.param)*/
    }


    useEffect(() => {
        updateInfo()
    }, [])

    return (
        <GHScrollView contentContainerStyle={{ flexGrow: 1, ...styles.container, paddingBottom: dp(150)}} nestedScrollEnabled={true}>
            <View style={{ width: '90%', height: '55%', backgroundColor: "rgba(191, 250, 0, 1)", borderRadius: moderateScale(27), marginTop: verticalScale(30) }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    paddingTop: verticalScale(15),
                    paddingLeft: horizontalScale(12),
                    paddingRight: horizontalScale(12)
                }}>
                    <TouchableOpacity onPress={() =>  navigation.goBack()}>
                        <Image source={require("../../../assets/icons/close.png")} style={{width: horizontalScale(22), height: verticalScale(22), resizeMode: 'contain'}} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../../../assets/icons/pencil.png')} style={{width: horizontalScale(18), height: verticalScale(18), resizeMode: 'contain'}} />
                    </TouchableOpacity>
                </View>
                {user &&
                    <View style={{display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Image
                            source={require('../../../assets/icons/avatar.png')}
                            style={{
                                maxWidth:  horizontalScale(90),
                                maxHeight: verticalScale(90),
                                resizeMode: 'contain'
                            }}
                        />
                        <Text style={{marginTop: verticalScale(10), fontSize: moderateScale(17), fontWeight: "600",}}>{user.name ? user.name : "" }</Text>
                        <Text style={{marginTop: verticalScale(15), fontSize: moderateScale(13), fontWeight: "400"}}>{user.phone ? user.phone : ""}</Text>
                        <Text style={{marginTop: verticalScale(1), fontSize: moderateScale(13), fontWeight: "400"}}>{user.email ? user.email : ""}</Text>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',

                        }}>
                            <Text style={{marginTop: verticalScale(0), fontSize: moderateScale(30), fontWeight: "600", color: '#000000'}}>{user && user.cards && user.cards.balance ? user.cards.balance : 0}</Text>
                            <Image source={require('../../../assets/icons/onvi_black.png')} style={{width: horizontalScale(30), height: verticalScale(30), marginTop: verticalScale(0), resizeMode: 'contain'}} />
                        </View>
                        <Text style={{marginTop: verticalScale(0), fontSize: moderateScale(13), fontWeight: "400"}}>onvi бонусов</Text>
                    </View>
                }
            </View>
            <View
                style={{
                    display: 'flex',
                    width: '90%',
                    flexDirection: 'row',
                    marginTop: verticalScale(37),
                }}
            >
                <Text style={{fontSize: moderateScale(14), fontWeight: "400", paddingRight: horizontalScale(50)}}>Разрешить отправку уведомлений</Text>
                <OnviSwitch
                    size={'small'}
                />
            </View>
            <View
                style={{

                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: dp(25)

                }}
            >
                <TouchableOpacity style={{
                    width: '90%',
                    height: verticalScale(40),
                    backgroundColor: "#F5F5F5",
                    borderRadius: moderateScale(27),
                    flexDirection: 'row', // Added flexDirection: 'row' to align text horizontally
                    alignItems: 'center', // Added alignItems: 'center' to align text vertically
                }}
                    onPress={onAboutAppHandle}
                >
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: "100%", paddingRight: horizontalScale(10)}}>
                        <Text style={{
                            textAlign: 'left',
                            alignSelf: 'center', // Removed textAlignVertical and used alignSelf: 'center' to center text vertically
                            marginLeft: horizontalScale(15),
                            color: '#000',
                            fontSize:  moderateScale(13)// Added marginLeft to create spacing between the left edge and text
                        }}>О приложении</Text>
                        <Image
                            source={require('../../../assets/icons/arrow-up.png')}
                            style={{
                                width: horizontalScale(24),
                                height: verticalScale(24),
                                resizeMode: 'contain'
                                 // Optional: Add some space between icon and text
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{width: "90%", height: verticalScale(30), flex: 1, alignItems: 'flex-end', display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <View>
                    <Text style={{
                        fontSize: moderateScale(10),
                        fontWeight: "400",
                        textTransform: 'uppercase',
                        color: '#AFAEAE'
                    }}>УДАЛИТЬ АККАУНТ</Text>
                </View>
                <TouchableOpacity onPress={signOut}>
                    <Text style={{
                        fontSize: moderateScale(16),
                        fontWeight: "400",
                        color: '#000000'
                    }}>Выйти</Text>
                </TouchableOpacity>
            </View>
        </GHScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        borderRadius: 22,
        alignItems: 'center'
    },
})

export { Settings };
