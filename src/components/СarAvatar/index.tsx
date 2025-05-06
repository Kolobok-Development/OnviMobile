import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { dp } from '../../utils/dp';

type TCar = 'sedan' | 'hatchback' | 'suv' | 'universall' | 'coupe' | 'miniven';

type TColor = 'black' | 'white' | 'silver' | 'blue' | 'red' | 'purple' | 'yellow';

interface ICarType {
    id: string,
    name: TCar,
    text: string
};

interface IColor {
    id: string,
    name: TColor,
    color: string,
    text: string
};

type TCarImageKey = `${TColor}_${TCar}`;

type CarImages = {
    [key in TCarImageKey]?: number
};

const types: ICarType[] = [
    { id: "1", name: "sedan", text: "Седан" },
    { id: "2", name: "hatchback", text: "Хетчбек" },
    { id: "3", name: "suv", text: "Внедорожник" },
    { id: "4", name: "universall", text: "Универсал" },
    { id: "5", name: "coupe", text: "Купе" },
    { id: "6", name: "miniven", text: "Минивен" },
];

const colors: IColor[] = [
    { id: "1", name: "black", color: "#000000", text: "Черный" },
    { id: "2", name: "white", color: "#FFFFFF", text: "Белый" },
    { id: "3", name: "silver", color: "#C0C0C0", text: "Серебрянный" },
    { id: "4", name: "blue", color: "#2F39F8", text: "Синий" },
    { id: "5", name: "red", color: "#F14519", text: "Красный" },
    { id: "6", name: "purple", color: "#8D009C", text: "Фиолетовый" },
    { id: "7", name: "yellow", color: "#FFDB58", text: "Желтый" },
];

const carImages: CarImages = {
    black_sedan: require('../../assets/cars/sedan/black_sedan.png'),
    white_sedan: require('../../assets/cars/sedan/white_sedan.png'),
    silver_sedan: require('../../assets/cars/sedan/silver_sedan.png'),
    blue_sedan: require('../../assets/cars/sedan/blue_sedan.png'),
    red_sedan: require('../../assets/cars/sedan/red_sedan.png'),
    purple_sedan: require('../../assets/cars/sedan/purple_sedan.png'),
    yellow_sedan: require('../../assets/cars/sedan/yellow_sedan.png'),

    black_hatchback: require('../../assets/cars/hatchback/black_hatchback.png'),
    white_hatchback: require('../../assets/cars/hatchback/white_hatchback.png'),
    silver_hatchback: require('../../assets/cars/hatchback/silver_hatchback.png'),
    blue_hatchback: require('../../assets/cars/hatchback/blue_hatchback.png'),
    red_hatchback: require('../../assets/cars/hatchback/red_hatchback.png'),
    purple_hatchback: require('../../assets/cars/hatchback/purple_hatchback.png'),
    yellow_hatchback: require('../../assets/cars/hatchback/yellow_hatchback.png'),

    black_suv: require('../../assets/cars/suv/black_suv.png'),
    white_suv: require('../../assets/cars/suv/white_suv.png'),
    silver_suv: require('../../assets/cars/suv/silver_suv.png'),
    blue_suv: require('../../assets/cars/suv/blue_suv.png'),
    red_suv: require('../../assets/cars/suv/red_suv.png'),
    purple_suv: require('../../assets/cars/suv/purple_suv.png'),
    yellow_suv: require('../../assets/cars/suv/yellow_suv.png'),

    black_universall: require('../../assets/cars/universall/black_universall.png'),
    white_universall: require('../../assets/cars/universall/white_universall.png'),
    silver_universall: require('../../assets/cars/universall/silver_universall.png'),
    blue_universall: require('../../assets/cars/universall/blue_universall.png'),
    red_universall: require('../../assets/cars/universall/red_universall.png'),
    purple_universall: require('../../assets/cars/universall/purple_universall.png'),
    yellow_universall: require('../../assets/cars/universall/yellow_universall.png'),

    black_coupe: require('../../assets/cars/coupe/black_coupe.png'),
    white_coupe: require('../../assets/cars/coupe/white_coupe.png'),
    silver_coupe: require('../../assets/cars/coupe/silver_coupe.png'),
    blue_coupe: require('../../assets/cars/coupe/blue_coupe.png'),
    red_coupe: require('../../assets/cars/coupe/red_coupe.png'),
    purple_coupe: require('../../assets/cars/coupe/purple_coupe.png'),
    yellow_coupe: require('../../assets/cars/coupe/yellow_coupe.png'),

    black_miniven: require('../../assets/cars/miniven/black_miniven.png'),
    white_miniven: require('../../assets/cars/miniven/white_miniven.png'),
    silver_miniven: require('../../assets/cars/miniven/silver_miniven.png'),
    blue_miniven: require('../../assets/cars/miniven/blue_miniven.png'),
    red_miniven: require('../../assets/cars/miniven/red_miniven.png'),
    purple_miniven: require('../../assets/cars/miniven/purple_miniven.png'),
    yellow_miniven: require('../../assets/cars/miniven/yellow_miniven.png'),
};

const CarAvatar = () => {

    const [selectedColor, setSelectedColor] = useState<IColor>(colors[0] ?? { id: "0", name: "black", color: "#000000", text: "Черный" });
    const [selectedType, setSelectedType] = useState<ICarType>(types[0] ?? { id: "0", name: "sedan", text: "Седан" });

    const getCarImage = (): number | undefined => {
        const imageKey: TCarImageKey = `${selectedColor.name}_${selectedType.name}`;
        if (carImages[imageKey]) {
            return carImages[imageKey];
        } else {
            return carImages["black_sedan"];
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Аватар машины</Text>

            <View style={styles.carImageCnt}>
                <Image style={styles.carImage} source={getCarImage()} />
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Тип кузова</Text>
                <Text style={styles.titleText}>
                    {selectedType.text}
                </Text>
            </View>

            <View style={styles.svContainer}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {types.map(item => (
                        <TouchableOpacity
                            style={[
                                styles.carTypeButton,
                                selectedType.id === item.id && styles.carTypeButtonSelected
                            ]}
                            key={item.id}
                            onPress={() => setSelectedType(item)}
                        >
                            <Text style={styles.carTypeButtonText}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Цвет автомобиля</Text>
                <Text style={styles.titleText}>
                    {selectedColor.text}
                </Text>
            </View>

            <View style={styles.colorsContainer}>
                {colors.map(item => (
                    <TouchableOpacity
                        style={[
                            styles.carColorButton,
                            { backgroundColor: item.color },
                            item.color === '#FFFFFF' && styles.carColorButtonWhite,
                            selectedColor.id === item.id && styles.carColorButtonSelected
                        ]}
                        key={item.id}
                        onPress={() => setSelectedColor(item)}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
    },
    title: {
        fontSize: dp(24),
        fontWeight: '600',
        lineHeight: dp(24),
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 0.33,
    },
    carImageCnt: {
        display: 'flex',
        alignItems: 'center',
    },
    carImage: {
        width: dp(138),
        height: dp(74),
        objectFit: 'contain',
        borderColor: 'black',
        borderStyle: 'solid',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: dp(12),
        marginBottom: dp(12),
    },
    titleText: {
        fontSize: dp(18),
        fontWeight: '600',
        color: '#000000',
    },
    svContainer: {
        height: dp(40),
    },
    carTypeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        paddingRight: dp(14),
        paddingLeft: dp(14),
        paddingTop: dp(9),
        paddingBottom: dp(9),
        borderRadius: dp(69),
        marginRight: dp(10),
        backgroundColor: '#F5F5F5',
    },
    carTypeButtonSelected: {
        backgroundColor: '#BFFA00'
    },
    carTypeButtonText: {
        textAlign: 'center',
        color: '#000000',
        fontSize: dp(12),
        fontWeight: '600',
    },
    colorsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    carColorButton: {
        width: dp(28),
        height: dp(28),
        borderRadius: 20,
    },
    carColorButtonWhite: {
        borderColor: '#A7A7A7',
        borderWidth: 1,
    },
    carColorButtonSelected: {
        borderWidth: 2,
        borderColor: '#BFFA00',
    }
});

export { CarAvatar };