import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, Image, StyleSheet} from 'react-native';

import Modal from '@styled/Modal';

import {Button} from '@styled/buttons';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {dp} from '@utils/dp.ts';
import {WHITE} from '@utils/colors.ts';

import {BusinessHeader} from '@components/Business/Header';
import {CheckBox} from '@styled/buttons/CheckBox';

import {Tag} from '../../../types/api/app/types.ts';
import useStore from '../../../state/store.ts';
import {getFreeVacuum} from '@services/api/user/index.ts';

const BusinessInfo = () => {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    business,
    orderDetails,
    setOrderDetails,
    bottomSheetRef,
    bottomSheetSnapPoints,
    setFreeVacuum,
  } = useStore.getState();

  const modalCallback = async (bayType: string) => {
    setOrderDetails({...orderDetails, bayType: bayType});
    if (bayType === 'VACUUME') {
      const data = await getFreeVacuum();
      console.log('getFreeVacuum: ', data);
      setFreeVacuum(data);
    }
    navigateBottomSheet('Boxes', {bayType: bayType});
    bottomSheetRef?.current?.snapToPosition(
      bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
    );
  };

  const forceForward = () => {
    setModalVisible(false);
    navigateBottomSheet('Boxes', {});
    bottomSheetRef?.current?.snapToPosition(
      bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../../assets/emojies/thinking.png')}
              style={{width: dp(40), height: dp(40), resizeMode: 'contain'}}
            />
            <Text style={styles.modalTitle}>
              {t('app.business.farFromWash')}
            </Text>
            <Text style={styles.modalText}>
              {t('app.business.somethingWrong')}
            </Text>

            <View style={styles.actionButtons}>
              <View style={{paddingRight: dp(14)}}>
                <Button
                  onClick={() => setModalVisible(false)}
                  label={t('navigation.back')}
                  color="blue"
                  width={129}
                  height={42}
                  fontSize={18}
                  fontWeight="600"
                />
              </View>
              <Button
                onClick={forceForward}
                label={t('common.buttons.allOk')}
                color="blue"
                width={129}
                height={42}
                fontSize={18}
                fontWeight="600"
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={{paddingTop: dp(15)}} />
      <BusinessHeader type="navigate" />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingTop: dp(10),
        }}>
        {business &&
          business.carwashes.length &&
          orderDetails &&
          typeof orderDetails.carwashIndex !== 'undefined' &&
          business.carwashes[orderDetails.carwashIndex].tags &&
          business.carwashes[orderDetails.carwashIndex].tags.length > 0 &&
          business.carwashes[orderDetails.carwashIndex].tags.map(
            (tag: Tag, index: number) => (
              <View style={{padding: dp(2)}} key={`tag-${index}`}>
                <CheckBox
                  disable={true}
                  borderRadius={dp(69)}
                  text={'🚀 ' + tag.name}
                  backgroundColor={'#BFFA00'}
                  textColor={'#000000'}
                  fontSize={dp(12)}
                  fontWeight={'600'}
                  height={dp(24)}
                  onClick={() => null}
                />
              </View>
            ),
          )}
      </View>
      <View
        style={{
          alignSelf: 'center',
          paddingTop: dp(56),
          justifyContent:
            orderDetails &&
            Number(orderDetails.carwashIndex) >= 0 &&
            business?.carwashes[Number(orderDetails.carwashIndex)].vacuums
              ?.length
              ? 'space-between'
              : 'center',
          flexDirection: 'row',
          width: '100%',
        }}>
        {orderDetails &&
        Number(orderDetails.carwashIndex) >= 0 &&
        business?.carwashes[Number(orderDetails.carwashIndex)].vacuums
          ?.length ? (
          <Button
            color={'blue'}
            label={t('app.business.letsVacuum')}
            width={147}
            height={47}
            fontSize={16}
            fontWeight={'600'}
            onClick={() => modalCallback('VACUUME')}
          />
        ) : (
          <></>
        )}

        <Button
          color={'blue'}
          label={t('app.business.letsWash')}
          width={147}
          height={47}
          fontSize={16}
          fontWeight={'600'}
          onClick={() => modalCallback('BAY')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: dp(22),
    paddingLeft: dp(22),
    paddingRight: dp(22),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: dp(21.75),
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    paddingBottom: dp(7),
  },
  text: {
    fontSize: dp(16),
    fontWeight: '400',
  },
  circleImage: {
    width: dp(45),
    height: dp(45),
  },
  /**/
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 38,
    width: dp(341),
    height: dp(222),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    paddingBottom: dp(3),
  },
  modalText: {
    fontWeight: '400',
    fontSize: dp(16),
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: dp(27),
  },
});

export {BusinessInfo};
