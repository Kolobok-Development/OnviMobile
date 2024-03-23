import { Balance } from "@components/Balance"
import React from "react"

import { View, StyleSheet, Text, Image } from "react-native"

import { dp } from "../../../utils/dp"
import CustomSwitch from "@styled/buttons/CustomSwitch";

interface BalanceCardProps {
    option: any
}

const BalanceCard = ({ option } : BalanceCardProps) => {

    const humanDate = (date: any, timezone: string) => {
        if (!date) return "";
        const dateTime = new Date(date.replace(/-/g, "/"));

        let zone = "";

        if (timezone) {
          zone = " (" + timezone + ")";
        }

        if (isNaN(dateTime.getDate()) || isNaN(dateTime.getFullYear())) {
          return (
            new Date(date).toLocaleDateString("ru", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) + zone
          );
        } else {
          const russianMonths = [
            "янв.",
            "февр.",
            "мар.",
            "апр.",
            "мая",
            "июн.",
            "июл.",
            "авг.",
            "сент.",
            "окт.",
            "нояб.",
            "дек.",
          ];

          return (
            russianMonths[dateTime.getMonth()] +
            " " +
            dateTime.getDate() +
            ", " +
            dateTime.getFullYear() +
            zone
          );
        }
      };


    const positive = option.operType === "Зачисление" ? true : false
    const withdraw = option.operType === "Снятие" ? true : false


// operType -> Зачисление | Снятие
// operSum

    //Where widthraw then black -
    //Else green +

    return (
        <View style={styles.box}>
            <View style={styles.leftSide}>
                <Text style={styles.date}>{humanDate(option.operDate, "")}</Text>
                <Text style={styles.title}>{option.carWash}</Text>
                <Text style={styles.text}>{option.address}</Text>
            </View>
            <View style={styles.rightSide}>
                <Text style={styles.rubles}>{option.operSum} ₽</Text>
                <View style={styles.balance}>
                    {
                        withdraw ?
                            <CustomSwitch value={false}
                                          inActiveText={`-${option.operSum}`}
                                          disabled={true}
                                          backgroundInActive="#000"
                                          circleImageInactive={require('../../../assets/icons/small-icon.png')}
                                          circleSize={dp(17)} // Adjust the circle size as needed
                                          switchBorderRadius={20}
                                          width={dp(55)} // Adjust the switch width as needed
                                          textStyle={{ fontSize: dp(12), color: 'white', fontWeight: '600' }}
                            />
                            :
                            <CustomSwitch value={false}
                            inActiveText={`+${option.cashBackAmount}`}
                            disabled={true}
                            backgroundInActive="#BFFA00FF"
                            circleImageInactive={require('../../../assets/icons/small_icon_black.png')}
                            circleSize={dp(17)} // Adjust the circle size as needed
                            switchBorderRadius={20}
                            width={dp(55)} // Adjust the switch width as needed
                            textStyle={{ fontSize: dp(12), color: '#000', fontWeight: '600' }} />
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        marginVertical: 10,
        width: dp(342),
        minHeight: dp(85),
        backgroundColor: "#F5F5F5",
        borderRadius: dp(25),
        display: "flex",
        flexDirection: "row",
        paddingLeft: dp(20),
        paddingRight: dp(20),
        paddingTop: dp(8),
        paddingBottom: dp(8)
    },
    date: {
        color: "rgba(11, 104, 225, 1)",
        fontWeight: "700",
        fontSize: dp(10),
    },
    title: {
        color: "#000000",
        fontWeight: "500",
        fontSize: dp(15),
        marginTop: dp(5)
    },
    text: {
        color: "#000000",
        fontWeight: "400",
        fontSize: dp(10),
        marginTop: dp(5)
    },
    leftSide: {
        flex: 5,
        display: "flex",
        flexDirection: "column",
    },
    rightSide: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
    },
    rubles: {
        fontWeight: "600",
        fontSize: dp(24)
    },
    balance: {
        marginTop: dp(5)
    },
    balanceText: {
        fontSize: dp(12)
    }
})

export { BalanceCard }
