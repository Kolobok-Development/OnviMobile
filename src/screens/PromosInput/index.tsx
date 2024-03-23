import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {dp} from '@utils/dp';
import {BackButton} from '@components/BackButton';
import {useState} from 'react';
import {Button} from '@styled/buttons/Button';
import {useNavigation} from '@react-navigation/core';

const PromosInput = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  const validatePromoCode = () => {
    console.log('validating');
  };

  const clearInput = () => {
    setSearch('');
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            callback={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder="Введите промокод"
            maxLength={19}
            value={search}
            onChangeText={setSearch}
            style={{
              backgroundColor: 'rgba(245, 245, 245, 1)',
              borderRadius: dp(25),
              width: '100%',
              height: dp(40),
              textAlign: 'left',
              fontSize: dp(16),
              color: '#000000',
              paddingLeft: dp(20),
            }}
          />
          <View style={styles.action}>
            <Button
              label={'Очистить'}
              color={'lightGrey'}
              fontSize={dp(16)}
              height={dp(35)}
              width={dp(125)}
              onClick={() => clearInput()}
            />
            <Button
              label={'Применить'}
              color={'blue'}
              fontSize={dp(16)}
              height={dp(35)}
              width={dp(125)}
              onClick={() => validatePromoCode()}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: dp(20),
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(30),
    alignItems: 'center',
  },
  action: {
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: dp(30),
    justifyContent: 'space-between',
  },
});

export {PromosInput};
