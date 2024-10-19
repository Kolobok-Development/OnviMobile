import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Button} from '@styled/buttons';
import {dp} from '../../utils/dp';
import {X} from 'react-native-feather';

import Modal from '@styled/Modal';

export interface IInputData {
  placeholder: string;
  inputType?: string;
}

export interface IPromoCodeData {
  code: string;
}

export interface IPromoModalProps {
  isVisible?: boolean;
  type?: 'input' | 'promo_code';
  title: string;
  content: string;
  inputData?: IInputData;
  promoCodeData?: IPromoCodeData;
  buttonText: string;
  onClose?: () => void;
  onConfirm?: (data?: string) => void;
}

const PromoModal: React.FC<IPromoModalProps> = ({
  type,
  isVisible,
  title,
  content,
  inputData,
  promoCodeData,
  buttonText,
  onClose = () => {},
  onConfirm = () => {},
}) => {
  const [inputText, setInputText] = useState('');

  const handleConfirm = () => {
    if (type === 'input') {
      onConfirm(inputText);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible ?? false}
      animationType="slide"
      transparent={true}
      onClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X stroke={'rgba(0, 0, 0, 0.5)'} />
            </TouchableOpacity>
          </View>

          {type === 'input' ? (
            <>
              <Text style={styles.modalText}>{content}</Text>
              {inputData && (
                <TextInput
                  style={styles.inputField}
                  placeholder={inputData.placeholder}
                  value={inputText}
                  onChangeText={setInputText}
                />
              )}
            </>
          ) : type === 'promo_code' ? (
            <>
              <Text style={styles.modalText}>{content}</Text>
              {promoCodeData && (
                <Text style={styles.modalText}>{promoCodeData.code}</Text>
              )}
            </>
          ) : (
            <Text style={styles.modalText}>{content}</Text>
          )}
          <Button
            label={buttonText}
            width={dp(125)}
            onClick={handleConfirm}
            color={'blue'}
            fontSize={dp(12)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: dp(20),
    borderRadius: dp(10),
    alignItems: 'center',
    width: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalTitle: {
    textAlign: 'auto',
    fontSize: dp(18),
    fontWeight: 'bold',
    marginBottom: dp(10),
  },
  modalText: {
    alignSelf: 'flex-start',
    fontSize: dp(14),
    marginBottom: dp(15),
  },
  inputField: {
    borderWidth: 1,
    borderRadius: dp(15),
    borderColor: 'gray',
    padding: dp(10),
    marginBottom: dp(15),
    width: '100%',
  },
});

export default PromoModal;
