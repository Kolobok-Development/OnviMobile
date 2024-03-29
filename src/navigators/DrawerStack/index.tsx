import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

import { Home } from '@screens/Home';
import { Promos } from "@screens/Promos"

import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {dp} from "../../utils/dp";
import {useTheme} from "@context/ThemeProvider";
import {formatPhoneNumber} from "../../utils/phoneFormat";
import {Settings} from "@screens/Settings";
import {About} from "@screens/About";
import {useAuth} from "@context/AuthContext";
import {Partners} from "@screens/Partners";
import {Partner} from "@screens/Partner";

import { avatarSwitch } from '@screens/Settings';

interface CustomDrawerItemProps {
    label: string
    color: string
    onPress: any
}

const CustomDrawerItem = ({ label, color, onPress } : CustomDrawerItemProps) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                paddingBottom: dp(15)

            }}
            onPress={onPress}
        >
            <Text
                style={{
                    color: color,
                    fontWeight: '500',
                    fontSize: dp(20),
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

interface CustomDrawerContentProps {
    navigation: any;
    theme: any;
    user: any;
}

const CustomDrawerContent = ({ navigation, theme, user } : CustomDrawerContentProps) => {
    const { store }: any = useAuth();

    const initialAvatar = store.avatar || 'both.jpg'

    const avatarValue = avatarSwitch(initialAvatar)

    return (
         <View style={{ flex: 1}}>
             <DrawerContentScrollView
                scrollEnabled={false}
             >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        paddingTop:  dp(20),
                        paddingLeft:  dp(20),
                    }}
                >
                    {/*Profile*/}
                        <Image
                            source={avatarValue}
                            style={{
                                width: dp(48),
                                height: dp(48),
                                marginTop: dp(40)
                            }}
                        />
                    {/*items*/}
                    <View>
                        {user && user.name &&
                            <Text style={{
                            paddingTop:  dp(24),
                            fontStyle: 'normal',
                            fontSize: dp(24),
                            fontWeight: '600',
                            lineHeight: dp(23),
                            color: theme.textColor
                        }}>{user.name}</Text>}
                        {user && user.phone &&
                        <Text
                            style={{
                                paddingTop: dp(8),
                                marginBottom: dp(45),
                                fontStyle: 'normal',
                                fontSize: dp(10),
                                fontWeight: '600',
                                lineHeight: dp(20),
                                color: '#BEBEBE',

                            }}
                        >{formatPhoneNumber(user.phone)}</Text>}

                        <CustomDrawerItem
                            label={"Главная"}
                            color={theme.primary}
                            onPress={() => {
                                navigation.navigate("Главная")
                            }}
                        />
                        <CustomDrawerItem
                            label={"Партнеры"}
                            color={theme.textColor}
                            onPress={() => {
                                navigation.navigate("Партнеры")
                            }}
                        />
                        <CustomDrawerItem
                            label={"Промокод и скидки"}
                            color={theme.textColor}
                            onPress={() => {
                                navigation.navigate("Промокоды")
                            }}
                        />
                        <CustomDrawerItem
                            label={"Инструкции"}
                            color={theme.textColor}
                            onPress={() => {
                                navigation.navigate("Главная")
                            }}
                        />
                        <CustomDrawerItem
                            label={"Настройки"}
                            color={theme.textColor}
                            onPress={() => {
                                navigation.navigate("Настройки")
                            }}
                        />
                    </View>
                </View>
             </DrawerContentScrollView>
             <View style={{
                 padding: dp(20),
                 display: 'flex',
                 flexDirection: 'column',
                 marginBottom: dp(80)
             }}>
                 <View
                     style={{
                         flexDirection: 'row',
                         justifyContent: 'flex-start',
                         alignItems: 'center'
                     }}>

                     {/* <TelegramIcon  width={dp(28)} height={dp(28)}
                        style={{ marginRight: dp(5)}}
                     />
                     <VkIcon width={dp(28)} height={dp(28)}
                             style={{ marginRight: dp(15)}}
                     /> */}

                     <TouchableOpacity onPress={() => Linking.openURL('https://t.me/adamsbear34')}>
                         <Text style={{
                             fontSize: dp(10),
                             color: "#717586",
                             fontWeight: '600'
                         }}>Служба поддержки</Text>
                     </TouchableOpacity>
                 </View>
             </View>

         </View>
     )
}

const DrawerStack = () => {
    const { theme }: any = useTheme()
    const { store }: any = useAuth();

    return (
        <NavigationContainer independent={false}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerType:  'front',
                    drawerStyle: {
                        backgroundColor: theme.mainColor,
                        ...styles.drawer },
                }}

                initialRouteName={"Главная"}
                drawerContent={props => {
                    return (
                        <>
                        {store && <CustomDrawerContent
                            navigation={props.navigation}
                            theme={theme}
                            user={store}
                        />}
                        </>
                    )
                }}
            >
                <Drawer.Screen name="Главная">
                    { props => <Home navigation={props.navigation} />}
                </Drawer.Screen>
                
                <Drawer.Screen name="Промокоды">
                    { props => <Promos />}
                </Drawer.Screen>
                <Drawer.Screen name="Партнеры">
                    { props => <Partners /> }
                </Drawer.Screen>
                <Drawer.Screen name="Настройки">
                    { props => <Settings /> }
                </Drawer.Screen>
                <Drawer.Screen name="О приложении">
                    { props => <About /> }
                </Drawer.Screen>
                <Drawer.Screen name="Партнер">
                    { props => <Partner /> }
                </Drawer.Screen>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    drawer: {
        width: '65%',
    },
    drawerContent: {
        flex: 1,
    }

});

export { DrawerStack };
