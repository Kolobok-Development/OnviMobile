import React from 'react';

import {StyleSheet, View, Text} from 'react-native';

import {dp} from '../../../utils/dp';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';

import {Button} from '@styled/buttons';

import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

interface IPromocodeModal {
  onClose: () => void;
  promocode: string;
  handleSearchChange: (a: string) => void;
  apply: () => void;
  promocodeError: string | null;
  fetching: boolean;
}

const PromocodeModal = (props: IPromocodeModal) => {
  return (
    <>
      <View style={styles.contentContainer}>
        <Text style={{...styles.titleText, marginBottom: dp(20)}}>
          Введите промокод
        </Text>
        <View style={styles.textInputGroup}>
          <BottomSheetTextInput
            value={props.promocode}
            placeholder={'ПРОМОКОД'}
            onChangeText={(val: string) => {
              props.handleSearchChange(val);
            }}
            style={styles.bottomSheetTextInput}
          />
        </View>
        {props.promocodeError && (
          <Text
            style={{
              alignSelf: 'flex-start',
              paddingLeft: dp(15),
              marginTop: dp(5),
              color: '#000000',
              fontSize: dp(16),
              fontWeight: '400',
            }}>
            {props.promocodeError}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: dp(16),
            justifyContent: 'space-between',
            marginTop: dp(43),
          }}>
          <Button
            label={'Закрыть'}
            color={'blue'}
            width={dp(140)}
            height={dp(40)}
            fontSize={dp(16)}
            fontWeight={'600'}
            onClick={() => props.onClose()}
          />
          <View style={{width: dp(14)}} />
          <Button
            label={'Применить'}
            color={'blue'}
            width={dp(140)}
            height={dp(40)}
            fontSize={dp(16)}
            fontWeight={'600'}
            disabled={false}
            onClick={() => {
              props.apply();
            }}
            showLoading={props.fetching}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  modalView: {
    height: dp(278),
    width: dp(341),
    borderRadius: dp(38),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingLeft: dp(10),
    paddingRight: dp(10),
  },
  modalImage: {
    width: dp(135),
    height: dp(135),
  },
  promoCodeTextInput: {
    backgroundColor: 'rgba(216, 217, 221, 1)',
    borderRadius: moderateScale(25),
    alignSelf: 'stretch',
    width: horizontalScale(200),
    height: verticalScale(35),
    fontSize: moderateScale(10),
    textAlign: 'left',
    padding: 5,
    color: '#000000',
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    paddingBottom: dp(3),
  },
  modalText: {
    fontSize: dp(16),
    paddingTop: dp(16),
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: dp(27),
    width: '100%',
  },

  //

  contentContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    padding: dp(10),
  },
  bottomSheetTextInput: {
    borderRadius: dp(10),
    width: '100%',
    height: dp(45),
    fontSize: dp(16),
    fontWeight: '500',
    textAlign: 'left',
    padding: 6,
    color: '#3461FF',
    paddingLeft: dp(10),
  },
  label: {
    fontSize: dp(15),
    fontWeight: '600',
    color: '#000',
  },

  ////
  sheetContainer: {
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    height: dp(100),
  },
  titleText: {
    fontSize: dp(24),
    fontWeight: '600',
    lineHeight: dp(24),
    color: '#000000',
    textAlign: 'center',
  },
  textInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dp(15),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(22),
  },
});

export {PromocodeModal};
