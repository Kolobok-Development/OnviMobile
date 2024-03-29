import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useRoute} from "@react-navigation/native";
import {dp} from "../../utils/dp";
import {BurgerButton} from "@navigators/BurgerButton";
import {Partner as PartnerType} from "../../api/AppContent/types";
import Markdown from "react-native-markdown-display";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {Button} from "@styled/buttons";
import PromoModal, {IPromoModalProps, IInputData} from "@components/PromoModal";



const Partner = () => {
    const route: any = useRoute();

    const [partner, setPartner] = useState<PartnerType | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<IPromoModalProps | null>(null);

    useEffect(() => {
        if (route && route.params && route.params.data && route.params.data){
            setPartner(route.params.data);
        }
    },[]);

    useEffect(() => {
        console.log(modalData);
        console.log(modalVisible);
    }, [modalData])
    // Function to open the modal
    const openModal = () => {
        setModalVisible(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setModalVisible(false);
    };

    // Function to handle confirming modal action
    const handleConfirm = (inputValue: any) => {
        // Handle the action based on the input value (e.g., send it to the server)
        console.log('Input Value:', inputValue);

        // Close the modal
        closeModal();
    };


    const PartnerPlaceholder = () => {
        return (
            <SkeletonPlaceholder borderRadius={4}>
                <View>
                    <SkeletonPlaceholder.Item
                        marginTop={dp(15)}
                        width={'100%'}
                        height={dp(190)}
                        borderRadius={dp(10)}
                        alignSelf="flex-start"
                        marginBottom={dp(10)}
                    />
                    <Text style={{marginTop: 6, fontSize: 14, lineHeight: 18}}>Hello world</Text>
                    <Text style={{marginTop: 6, fontSize: 14, lineHeight: 18, width: '50%'}}>Hello world</Text>
                    <Text style={{marginTop: 6, fontSize: 14, lineHeight: 18, width: '25%'}}>Hello world</Text>
                </View>
            </SkeletonPlaceholder>
        )
    }

    const renderCustomModal = () => {
       if (partner && modalData){
            if (partner.attributes.integration_type === 'input') {
                return (
                    <PromoModal
                        isVisible={modalVisible}
                        type="input"
                        title={modalData?.title}
                        content={modalData?.content}
                        inputData={modalData?.inputData}
                        buttonText={modalData?.buttonText}
                        onClose={closeModal}
                        onConfirm={handleConfirm}
                    />
                );
            } else if (partner.attributes.integration_type === 'promo_code') {
                return (
                    <PromoModal
                        isVisible={modalVisible}
                        type="promo_code"
                        title={modalData?.title}
                        content={modalData?.content}
                        promoCodeData={modalData?.promoCodeData}
                        buttonText={modalData?.buttonText}
                        onClose={closeModal}
                        onConfirm={() => closeModal()}
                    />
                );
            } else {
                return null; // Return null for unsupported types
            }
       }
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <BurgerButton isDrawerStack={true}/>
                    <Text style={styles.screenTitle}>{partner?.attributes.name}</Text>
                </View>
                {
                    partner ? <View style={styles.content}>
                       {renderCustomModal()}
                        <Image
                            source={{ uri: partner.attributes.image.data.attributes.url}}
                            style={styles.banner}
                        />
                        <View style={styles.contentHeader}>
                            <View style={styles.circleImageContainer}>
                                <Image source={{ uri: partner.attributes.partner_icon.data.attributes.url }} style={styles.circleImage} />
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text style={styles.name}>{partner.attributes.name}</Text>
                                <Text style={styles.description}>Кэшбек на покупку от 2 500</Text>
                            </View>
                        </View>
                        {/* @ts-ignore */}
                        <Markdown
                            style={{
                                body: {color: '#000', fontSize: dp(14)},
                            }}
                        >
                            { partner.attributes.content }
                        </Markdown>
                        <View style={styles.btn}>
                            <Button label={partner.attributes.button_title} width={dp(155)} color='blue' fontSize={dp(13)}
                                onClick={() => {
                                    if (partner.attributes.integration_type === 'input'){
                                        const inputData: IInputData = {
                                            placeholder: partner.attributes.itegration_data.placeholder,
                                        }
                                        setModalData({
                                            title: partner.attributes.name,
                                            content: partner.attributes.itegration_data.action_text,
                                            buttonText: 'Активировать',
                                            inputData: inputData,
                                        });
                                        setModalVisible(true)
                                    }else if (partner.attributes.integration_type == 'promo_code'){

                                    }
                                }}
                            />
                        </View>
                    </View>
                        :
                        <PartnerPlaceholder />
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       padding: dp(16),
       flexDirection: 'row',
       backgroundColor: '#FFF'
   },
   scrollView: {
       flexGrow: 1,
       paddingBottom: dp(30)
    },
    header: {
        flexDirection: 'row',
        textAlign: 'center',
        marginTop: dp(20)
    },
    screenTitle: {
        fontWeight: "600",
        fontSize: dp(24),
        marginLeft: dp(15),
        textAlignVertical: 'center',
        color: '#000'
    },
    content: {
        alignItems: 'center',
        marginTop: dp(15)
    },
    banner: {
       width: dp(342),
       height: dp(190),
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    circleImageContainer: {
        width: 56,
        height: 56,
        borderRadius: 28, // Half of width/height for a circle
        overflow: 'hidden', // Clip the image to the circle
        marginRight: 16,
    },
    circleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // Adjust the resizeMode as needed
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: dp(16),
        fontWeight: '600',
        color: '#000',
    },
    description: {
        fontSize: dp(10),
        color: '#000',
        fontWeight: '400',
        marginBottom: dp(5)
    },
    text: {
       color: '#000',
       fontSize: dp(12)
    },
    btn: {
       marginTop: dp(10)
    }
});

export { Partner };
