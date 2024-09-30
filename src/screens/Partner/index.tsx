import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {dp} from '../../utils/dp';
import {Partner as PartnerType} from '../../api/AppContent/types';
import Markdown from 'react-native-markdown-display';
import {Button} from '@styled/buttons';
import PromoModal, {IPromoModalProps, IInputData} from '@components/PromoModal';
import {BackButton} from '@components/BackButton';
import {useNavigation} from '@react-navigation/core';

import PartnerPlaceholder from './PartnerPlaceholder';

const Partner = () => {
  const route: any = useRoute();
  const navigation = useNavigation<any>();

  const [partner, setPartner] = useState<PartnerType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<IPromoModalProps | null>(null);

  useEffect(() => {
    if (route && route.params && route.params.data && route.params.data) {
      setPartner(route.params.data);
    }
  }, []);

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to handle confirming modal action
  const handleConfirm = (inputValue: any) => {
    closeModal();
  };

  const renderCustomModal = () => {
    if (partner && modalData) {
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <BackButton
              callback={() => {
                navigation.navigate('Партнеры');
              }}
            />
            <Text style={styles.screenTitle}>{partner?.attributes.name}</Text>
            <View style={{width: dp(50)}} />
          </View>
          {partner ? (
            <View style={styles.content}>
              {renderCustomModal()}
              <Image
                source={{uri: partner.attributes.image.data.attributes.url}}
                style={styles.banner}
              />
              <View style={styles.contentHeader}>
                <View style={styles.circleImageContainer}>
                  <Image
                    source={{
                      uri: partner.attributes.partner_icon.data.attributes.url,
                    }}
                    style={styles.circleImage}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.name}>{partner.attributes.name}</Text>
                  <Text style={styles.description}>
                    Кэшбек на покупку от 2 500
                  </Text>
                </View>
              </View>
              {/* @ts-ignore */}
              <Markdown
                style={{
                  body: {color: '#000', fontSize: dp(14)},
                }}>
                {partner.attributes.content}
              </Markdown>
              <View style={styles.btn}>
                <Button
                  label={partner.attributes.button_title}
                  width={dp(155)}
                  color="blue"
                  fontSize={dp(13)}
                  onClick={() => {
                    if (partner.attributes.integration_type === 'input') {
                      const inputData: IInputData = {
                        placeholder:
                          partner.attributes.itegration_data.placeholder,
                      };
                      setModalData({
                        title: partner.attributes.name,
                        content: partner.attributes.itegration_data.action_text,
                        buttonText: 'Активировать',
                        inputData: inputData,
                      });
                      setModalVisible(true);
                    } else if (
                      partner.attributes.integration_type == 'promo_code'
                    ) {
                    }
                  }}
                />
              </View>
            </View>
          ) : (
            <PartnerPlaceholder />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'row',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: dp(30),
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    color: '#000',
    letterSpacing: 0.2,
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  content: {
    alignItems: 'center',
    marginTop: dp(15),
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
    marginBottom: dp(5),
  },
  text: {
    color: '#000',
    fontSize: dp(12),
  },
  btn: {
    marginTop: dp(10),
  },
});

export {Partner};
