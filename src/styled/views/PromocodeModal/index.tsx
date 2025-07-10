import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button} from '@styled/buttons';

import {dp} from '../../../utils/dp';

interface IPromocodeModal {
  visible: boolean;
  onClose: () => void;
  promocode: string;
  handleSearchChange: (text: string) => void;
  apply: () => void;
  promocodeError: string | null;
  fetching: boolean;
}

const PromocodeModal = (props: IPromocodeModal) => {
  return (
    <Modal
      visible={props.visible}
      transparent={true}
      animationType="slide"
      onRequestClose={props.onClose}>
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <Text style={styles.titleText}>Введите промокод</Text>
              <View style={styles.textInputGroup}>
                <TextInput
                  value={props.promocode}
                  placeholder={'ПРОМОКОД'}
                  onChangeText={props.handleSearchChange}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.buttonContainer}>
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: '30%',
    backgroundColor: 'white',
    borderTopLeftRadius: dp(20),
    borderTopRightRadius: dp(20),
    padding: dp(20),
  },
  titleText: {
    fontSize: dp(24),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: dp(20),
  },
  textInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dp(15),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(22),
    paddingHorizontal: dp(10),
  },
  textInput: {
    flex: 1,
    height: dp(45),
    fontSize: dp(16),
    fontWeight: '500',
    color: '#3461FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dp(43),
  },
  button: {
    backgroundColor: 'blue',
    width: dp(140),
    height: dp(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(10),
  },
  buttonText: {
    color: 'white',
    fontSize: dp(16),
    fontWeight: '600',
  },
});

export {PromocodeModal};
