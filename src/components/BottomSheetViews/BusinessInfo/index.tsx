import React, {useState} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';

import Modal from '@styled/Modal';

import {Button} from '@styled/buttons';

import {useRoute} from '@react-navigation/native';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {dp} from '@utils/dp.ts';
import {WHITE} from '@utils/colors.ts';

import {BusinessHeader} from '@components/Business/Header';
import {CheckBox} from '@styled/buttons/CheckBox';

import {GeneralBottomSheetRouteProp} from 'src/types/BottomSheetNavigation';
import {Tag} from '../../../types/api/app/types.ts';

const BusinessInfo = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute<GeneralBottomSheetRouteProp<'BusinessInfo'>>();

  const modalCallback = () => {
    if (true) {
      navigateBottomSheet('Boxes', route.params);
      route.params.bottomSheetRef?.current?.snapToPosition('95%');
    } else {
      setModalVisible(false);
    }
  };

  const forceForward = () => {
    setModalVisible(false);
    navigateBottomSheet('Boxes', route.params);
    route.params.bottomSheetRef?.current?.snapToPosition('95%');
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
            <Text style={styles.modalTitle}>Вы далеко от мойки</Text>
            <Text style={styles.modalText}>Возможно мы что-то напутали</Text>

            <View style={styles.actionButtons}>
              <View style={{paddingRight: dp(14)}}>
                <Button
                  onClick={() => setModalVisible(false)}
                  label="Назад"
                  color="blue"
                  width={129}
                  height={42}
                  fontSize={18}
                  fontWeight="600"
                />
              </View>
              <Button
                onClick={forceForward}
                label="Все Ок"
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
        {route.params.tags &&
          route.params.tags.length > 0 &&
          route.params.tags.map((tag: Tag, index: number) => (
            <View style={{padding: dp(2)}}>
              <CheckBox
                key={index}
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
          ))}
      </View>
      <View style={{alignSelf: 'center', paddingTop: dp(36)}}>
        <Button
          color={'blue'}
          label={'Моемся'}
          width={187}
          height={57}
          fontSize={24}
          fontWeight={'600'}
          onClick={() => modalCallback()}
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
