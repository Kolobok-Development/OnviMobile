import { Text, View, StyleSheet, Image } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { ScrollView as GHScrollView } from 'react-native-gesture-handler';

import { BoxesSlide } from '@components/Boxes/BoxesSlide';
import { BusinessHeader } from '@components/Business/Header';

import { useAppState } from '@context/AppContext';

import { dp } from '../../../utils/dp';
import {Price} from "../../../api/AppContent/types";
import {CheckBox} from "@styled/buttons/CheckBox";

const Boxes = () => {
    const navigation: any = useNavigation();
    const route: any = useRoute()

    const { state, setState } = useAppState()

    const order = state.order

    return (
        <GHScrollView contentContainerStyle={{ flexGrow: 1}} nestedScrollEnabled={true}>
            <View style={styles.container}>
                    <View style={{
                        paddingTop: dp(15),
                        paddingLeft: dp(22),
                        paddingRight: dp(22),
                    }}>
                        <BusinessHeader type="empty" navigation={navigation} callback={() => setState({
                            ...state,
                            order: {
                                ...order,
                                box: null
                            }
                        })} position="60%"/>

                        <View style={styles.middle}>
                            <Text style={styles.middleText}>Выберите</Text>
                            <Text style={styles.middleText}>
                                бокс{' '}
                                <Text style={[styles.emoji, { lineHeight: 50 }]}>
                                    🚙
                                </Text>
                            </Text>
                            <View style={styles.boxes}>
                            <BoxesSlide boxes={route.params.boxes} navigation={navigation} params={route.params} />
                            </View>
                        </View>

                        <View style={styles.button}>
                        <Image source={require("../../../assets/icons/small-icon.png")} style={{width: dp(50), height: dp(50)}} />
                        </View>

                        <View style={styles.services}>
                            {
                                route.params.price.length > 0 &&
                                route.params.price.map((price: Price, index: number) => (
                                    <View style={{padding: dp(2)}}>
                                        <CheckBox
                                            key={index}
                                            disable={true}
                                            text={price.name}
                                            borderRadius={dp(69)}
                                            backgroundColor={'#F5F5F5'}
                                            textColor={'#000000'}
                                            fontSize={dp(11)}
                                            fontWeight={'600'}
                                            height={dp(24)}
                                            onClick={() => null}
                                        />
                                    </View>
                                ))
                            }
                        </View>

                    </View>
            </View>
        </GHScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: dp(22),
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: dp(24),
        fontWeight: '600',
    },
    text: {
        fontSize: dp(16),
        fontWeight: '400',
    },
    middle: {
        flex: 1,
        paddingLeft: dp(22),
        paddingRight: dp(22),
    },
    middleText: {
        fontSize: dp(36),
        fontWeight: "600",
        color: "#000",
    },
    boxes: {
        paddingTop: dp(81)
    },
    carImage: {
        width: dp(32),
        height: dp(32)
    },
    button: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: dp(22)
    },
    services: {
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: dp(40)
    },
    emoji: {
        fontSize: 36, // Adjust the font size of the emoji to match the text// Align on the baseline
    },
})

export { Boxes };
