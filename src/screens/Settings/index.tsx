import {
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {dp} from '../../utils/dp';
import React, {useMemo, useRef, useState} from 'react';
import useStore from '../../state/store';
import {formatPhoneNumber} from '../../utils/phoneFormat';
import {Button} from '@styled/buttons';
import {LogOut} from 'react-native-feather';
import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {BurgerButton} from '@navigators/BurgerButton';
import Switch from '@styled/buttons/CustomSwitch';
import {AvatarEnum} from '../../types/AvatarEnum.ts';
import {update} from '../../api/user/index.ts';

import {GeneralDrawerNavigationProp} from 'src/types/DrawerNavigation';

export const avatarSwitch = (avatar: string) => {
  switch (avatar) {
    case 'both.jpg':
      return require('../../assets/avatars/both.jpg');
    case 'female.jpg':
      return require('../../assets/avatars/female.jpg');
    case 'male.jpg':
      return require('../../assets/avatars/male.jpg');
    default:
      return require('../../assets/avatars/both.jpg');
  }
};

const Settings = () => {
  const {user, signOut, loadUser} = useStore();
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Настройки'>>();
  const [isLoading, setIsLoading] = useState(false);

  const initialUserName = user?.name || '';
  const initialEmail = user?.email || '';
  const initialPhone = user?.phone || '';
  const initialAvatar = (user?.avatar || 'both.jpg') as
    | 'both.jpg'
    | 'female.jpg'
    | 'male.jpg';

  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [email, setEmail] = useState(initialEmail);
  const [toggle, setToggle] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState<
    'both.jpg' | 'female.jpg' | 'male.jpg'
  >(initialAvatar);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const handleClosePress = () => {
    setEditing(false);
    // @ts-ignore
    bottomSheetRef.current.close();
  };

  const saveUserDate = async () => {
    setIsLoading(true);
    try {
      const avatarMapping: {[key in AvatarEnum]?: number} = {
        [AvatarEnum.ONE]: 1,
        [AvatarEnum.TWO]: 2,
        [AvatarEnum.THREE]: 3,
      };

      const avatar = avatarMapping[selectedAvatar];

      console.log('avatarMapping: ', avatarMapping);
      console.log('selectedAvatar: ', selectedAvatar);
      console.log('avatar: ', avatar);

      const userData: {name?: string; email?: string; avatar?: number} = {};

      if (userName) {
        userData.name = userName;
      }
      if (email) {
        userData.email = email;
      }
      if (avatar !== undefined) {
        userData.avatar = avatar;
      }

      update(userData)
        .then(async () => {
          await loadUser();
          setEditing(false);
          setIsLoading(false);
        })
        .catch(err => {
          console.log('Error updating: ', err.message);
          setIsLoading(false);
        });
    } catch (error: any) {
      setIsLoading(false);
      setEditing(false);
    }
  };

  const onAboutButtonHandle = () => {
    navigation.navigate('О приложении');
  };

  const renderOverlay = () => {
    if (editing) {
      return <View style={styles.overlay} />;
    }
    return null;
  };

  const avatarValue = avatarSwitch(selectedAvatar);

  const editingMode = () => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        keyboardBlurBehavior="restore"
        // add bottom inset to elevate the sheet
        bottomInset={dp(Dimensions.get('window').height / 5)}
        // set `detached` to true
        detached={true}
        style={styles.sheetContainer}
        backgroundStyle={{borderRadius: dp(38)}}
        handleHeight={dp(30)}
        handleIndicatorStyle={{display: 'none'}}>
        <View style={styles.contentContainer}>
          <Text style={{...styles.titleText, marginBottom: dp(20)}}>
            Личные данные
          </Text>
          <View style={styles.avatars}>
            <TouchableOpacity
              onPress={() => setSelectedAvatar('both.jpg')}
              style={
                styles[
                  selectedAvatar === 'both.jpg'
                    ? 'selectedAvatar'
                    : 'avatarButton'
                ]
              }>
              <Image
                style={{height: dp(80), width: dp(80), borderRadius: 50}}
                source={require('../../assets/avatars/both.jpg')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedAvatar('female.jpg')}
              style={
                styles[
                  selectedAvatar === 'female.jpg'
                    ? 'selectedAvatar'
                    : 'avatarButton'
                ]
              }>
              <Image
                style={{height: dp(80), width: dp(80), borderRadius: 50}}
                source={require('../../assets/avatars/female.jpg')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedAvatar('male.jpg')}
              style={
                styles[
                  selectedAvatar === 'male.jpg'
                    ? 'selectedAvatar'
                    : 'avatarButton'
                ]
              }>
              <Image
                style={{height: dp(80), width: dp(80), borderRadius: 50}}
                source={require('../../assets/avatars/male.jpg')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textInputGroup}>
            <Text style={{padding: dp(10)}}>👤</Text>
            <BottomSheetTextInput
              value={userName}
              placeholder={'Имя'}
              onChangeText={(val: string) => {
                setUserName(val);
              }}
              style={styles.bottomSheetTextInput}
            />
          </View>
          <View style={styles.textInputGroup}>
            <Text style={{padding: dp(10)}}>✉️</Text>
            <BottomSheetTextInput
              value={email}
              placeholder={'Почта'}
              onChangeText={(val: string) => {
                setEmail(val);
              }}
              style={styles.bottomSheetTextInput}
            />
          </View>
          <View
            style={{
              ...styles.textInputGroup,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
            <Text style={{padding: dp(10)}}>📞</Text>
            <BottomSheetTextInput
              editable={false}
              value={formatPhoneNumber(initialPhone)}
              placeholder={'Почта'}
              style={{
                ...styles.bottomSheetTextInput,
                backgroundColor: 'rgba(0, 0, 0, 0.008)',
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: dp(16),
            justifyContent: 'space-evenly',
          }}>
          <Button
            label={'Закрыть'}
            color={'blue'}
            width={dp(140)}
            height={dp(40)}
            fontSize={dp(16)}
            fontWeight={'600'}
            onClick={handleClosePress}
          />
          <Button
            label={'Сохранить'}
            color={'blue'}
            width={dp(140)}
            height={dp(40)}
            fontSize={dp(16)}
            fontWeight={'600'}
            disabled={isLoading}
            onClick={saveUserDate}
            showLoading={isLoading}
          />
        </View>
      </BottomSheet>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.header}>
          <BurgerButton isDrawerStack={true} />
          <Text style={styles.screenTitle}>Настройки</Text>
          <View style={{width: dp(50)}} />
        </View>
        <View style={styles.container}>
          <View style={styles.profileCard}>
            <Image source={avatarValue} style={styles.avatar} />
            <Text style={{...styles.titleText, marginTop: dp(12)}}>
              {userName}
            </Text>
            <Text style={{...styles.text, marginTop: dp(5)}}>
              {formatPhoneNumber(initialPhone)}
            </Text>
            <Text style={{...styles.text}}>{email}</Text>
            <View
              style={{
                marginTop: dp(40),
              }}>
              <View style={styles.balance}>
                <Text style={styles.balanceText}>
                  {user && user.cards && user.cards.balance
                    ? user.cards.balance
                    : 0}
                </Text>
                <Image
                  source={require('../../assets/icons/onvi_black.png')}
                  style={styles.balanceIcon}
                />
              </View>
              <Text style={styles.text}>Onvi бонусов</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Профиль</Text>
              <View style={styles.sectionBody}>
                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    style={[styles.row, styles.rowFirst]}
                    onPress={() => setEditing(true)}>
                    <Text style={styles.rowLabel}>Изменить личные данные</Text>
                    <Image
                      style={{
                        height: dp(24),
                        width: dp(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/icons/arrow-up.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                  <View style={[styles.row, styles.rowFirst]}>
                    <Text style={styles.rowLabel}>
                      Разрешить отправку уведомлений
                    </Text>
                    <Switch
                      value={toggle}
                      onValueChange={() => setToggle(!toggle)}
                      activeText={''}
                      inActiveText={''}
                      backgroundActive="#000"
                      backgroundInActive="#A3A3A6"
                      circleImageActive={require('../../assets/icons/small-icon.png')} // Replace with your image source
                      circleImageInactive={require('../../assets/icons/small-icon.png')} // Replace with your image source
                      circleSize={dp(18)} // Adjust the circle size as needed
                      switchBorderRadius={20}
                      width={dp(45)} // Adjust the switch width as needed
                      textStyle={{fontSize: dp(13), color: 'white'}}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Приложение</Text>
              <View style={styles.sectionBody}>
                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    style={[styles.row, styles.rowFirst]}
                    onPress={onAboutButtonHandle}>
                    <Text style={styles.rowLabel}>О приложении</Text>
                    <Image
                      style={{
                        height: dp(24),
                        width: dp(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/icons/arrow-up.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    style={[styles.row, styles.rowFirst]}
                    onPress={() => navigation.navigate('Правовые документы')}>
                    <Text style={styles.rowLabel}>Правовые документы</Text>
                    <Image
                      style={{
                        height: dp(24),
                        width: dp(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/icons/arrow-up.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    style={[styles.row, styles.rowFirst]}
                    onPress={() =>
                      Linking.openURL('https://t.me/+zW5dp29k0LYxZTUy')
                    }>
                    <Text style={styles.rowLabel}>Сообщить о проблеме</Text>
                    <Image
                      style={{
                        height: dp(24),
                        width: dp(24),
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/icons/arrow-up.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.footerBtns}>
            <TouchableOpacity style={styles.btnDelete}>
              <Text
                style={{fontSize: dp(10), fontWeight: '400', color: '#AFAEAE'}}>
                УДАЛИТЬ АККАУНТ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnExit} onPress={signOut}>
              <Text style={styles.text}>Выйти</Text>
              <LogOut height={dp(20)} width={dp(20)} stroke={'#000000'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {renderOverlay()}
      {editing && editingMode()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    textAlign: 'center',
    paddingLeft: dp(16),
    paddingTop: dp(16),
    paddingBottom: dp(3),
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
    color: '#000',
    letterSpacing: 0.2,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backImg: {
    width: dp(22),
    height: dp(22),
    resizeMode: 'contain',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: dp(300),
    alignItems: 'center',
    backgroundColor: '#BFFA00',
    borderRadius: dp(28),
  },
  avatar: {
    height: dp(70),
    width: dp(70),
    marginTop: dp(20),
    resizeMode: 'contain',
    borderRadius: 50,
  },
  balance: {
    display: 'flex',
    flexDirection: 'row',
  },
  balanceText: {
    fontSize: dp(36),
    fontWeight: '600',
    color: '#000000',
  },
  balanceIcon: {
    width: dp(28),
    height: dp(28),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: dp(5),
  },
  titleText: {
    fontSize: dp(24),
    fontWeight: '600',
    lineHeight: dp(24),
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.33,
  },
  text: {
    fontSize: dp(14),
    fontWeight: '400',
    lineHeight: dp(20),
    color: '#000000',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(15),
    width: '100%',
  },
  notification: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: dp(10),
    paddingLeft: dp(10),
  },
  btnAbout: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: dp(40),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderRadius: dp(27),
    justifyContent: 'space-between',
    padding: dp(10),
    marginTop: dp(24),
  },
  footerBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingBottom: dp(20),
  },
  btnDelete: {},
  btnExit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetContainer: {
    // add horizontal space
    marginHorizontal: dp(16),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    padding: dp(10),
  },
  bottomSheetTextInput: {
    flex: 1,
    paddingTop: dp(10),
    paddingRight: dp(10),
    paddingBottom: dp(10),
    paddingLeft: dp(0),
    height: dp(40),
    fontSize: dp(16),
    fontWeight: '400',
    textAlign: 'left',
    padding: 6,
    color: '#000000',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(30),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black color
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dp(15),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(30),
  },
  avatars: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  avatarButton: {
    borderRadius: 50,
  },
  selectedAvatar: {
    borderColor: '#BFFA00',
    borderWidth: 2,
    borderRadius: 50,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    marginLeft: dp(10),
    marginBottom: dp(10),
    fontSize: 13,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
    letterSpacing: 0.33,
  },
  sectionBody: {
    borderRadius: dp(10),
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: dp(10),
  },
  rowWrapper: {
    paddingLeft: dp(10),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderRadius: dp(10),
    borderColor: '#f0f0f0',
  },
  row: {
    height: dp(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: dp(5),
  },
  rowLabel: {
    fontSize: dp(13),
    letterSpacing: 0.22,
    color: '#000',
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export {Settings};
