import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { ScrollView } from 'react-native-gesture-handler';

import { dp } from '../../../utils/dp';

import { Button } from '@styled/buttons';
import { WHITE } from '../../../utils/colors';

import { Notification } from "@styled/cards/Notification"
import { BalanceCard } from '@styled/cards/BalanceCard';
import { NotificationCircle } from '@components/NotificationCircle';

import { useAxios } from '@hooks/useAxios';

import { useAuth } from '@context/AuthContext';

import { useRoute} from '@react-navigation/native';
import {Settings} from "react-native-feather";

import { avatarSwitch } from '@screens/Settings';
import EmptyPlaceholder from '@components/EmptyPlaceholder';

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

const History = ({ drawerNavigation } : any) => {
    const [tab, setTab] = useState(true)

    const { user }: any = useAuth()

    const switchTab = (val: boolean) => {
        setTab(val)
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [orders, setOrders] = useState([])

    const api = useAxios("CORE_URL")

    const route: any = useRoute();

    const initialAvatar = user.avatar || 'both.jpg'

    const avatarValue = avatarSwitch(initialAvatar)

    useEffect(() => {
        if (route && route.params && route.params.type && route.params.type === "history") {
            setTab(false)
        }
    }, [route.params.type])

    const getOrderHistory = async () => {
        await api.get("/account/orders/?size=10&page=1").then((data) => {
            setOrders(data.data.data)
        }).catch(err => console.log(err.response))
    }

    const loadData = async () => {
        setIsLoading(true)
        try {
            await getOrderHistory()

            setIsLoading(false)
        } catch (err) {
            console.error(err)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const HistoryPlaceholder = () => {
        return (
                <SkeletonPlaceholder borderRadius={4}>
                    <View>
                        <SkeletonPlaceholder.Item
                            marginTop={dp(30)}
                            width={'100%'}
                            height={dp(80)}
                            borderRadius={dp(10)}
                            alignSelf="center"
                            marginBottom={dp(10)}
                        />
                        <SkeletonPlaceholder.Item
                            width={'100%'}
                            height={dp(80)}
                            borderRadius={dp(10)}
                            alignSelf="center"
                            marginBottom={dp(10)}
                        />
                        <SkeletonPlaceholder.Item
                            width={'100%'}
                            height={dp(80)}
                            borderRadius={dp(10)}
                            alignSelf="center"
                            marginBottom={dp(10)}
                        />
                    </View>
                </SkeletonPlaceholder>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{paddingBottom: dp(30), flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", flex: 1, alignItems: "center"}}>
                    <Image
                        source={avatarValue}
                        style={{
                            width: dp(60),
                            height: dp(60),
                        }}
                    />
                    {user && user.name && <Text style={{ fontWeight: "600", fontSize: dp(24), paddingLeft: dp(5), flexShrink: 1 }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >{user.name}</Text>}
                </View>
                <View style={{ width: dp(34), height: dp(34), borderRadius: dp(50), backgroundColor: "#000000", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => {
                        route.params.drawerNavigation.navigate('Настройки')
                    }}>
                        <Settings stroke={'white'} width={dp(18)} height={dp(18)}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.actions}>
                <Button
                    label="История"
                    onClick={() => switchTab(false)}
                    color={!tab ? "blue" : "lightGrey"}
                    width={149}
                    height={43}
                    fontSize={18}
                    fontWeight="600"
                />
                <View style={{width: dp(3)}}></View>
                <View style={styles.notifications}>
                    <Button
                        label="Уведомления"
                        onClick={() => switchTab(true)}
                        color={tab ? "blue" : "lightGrey"}
                        width={189}
                        height={43}
                        fontSize={18}
                        fontWeight="600"
                    />
                    <NotificationCircle number={4} />
                </View>
            </View>
            {
                isLoading ? <HistoryPlaceholder /> : <>
                    {!tab ? (
                        <ScrollView contentContainerStyle={{paddingBottom: dp(200)}} showsVerticalScrollIndicator={false}>
                            {orders.length ? orders.map((order, index) => (
                                <BalanceCard key={index} option={order} />
                            )) : <EmptyPlaceholder text='История операций пока пуста' />}
                        </ScrollView>
                    ) : (
                        <ScrollView>
                            {[].length ? notifications.map((notification, index) => (
                                <Notification key={index} option={notification} />
                            )) : <EmptyPlaceholder text='У вас пока нет уведомлений. Они будут отображены здесь, когда появятся.' />}
                        </ScrollView>
                    )}
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get("screen").height,
        backgroundColor: WHITE,
        borderRadius: 22,
        padding: dp(16)
    },
    actions: {
        display: 'flex',
        flexDirection: 'row'
    },
    box: {
        marginVertical: 10,
        width: dp(342),
        height: dp(78),
        backgroundColor: "#F5F5F5",
        borderRadius: dp(25)
    },
    scrollView: {
        flex: 1,
    },
    notifications: {
        position: "relative",
        flexDirection: 'row'
    }
})

export { History };
