import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View, Text, Image, StyleSheet} from 'react-native';
import {BLUE, WHITE} from '../../../../utils/colors';
import {dp} from '../../../../utils/dp';
import useStore from '../../../../state/store';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {CarWashLocation} from 'src/types/api/app/types';
import calculateDistance from '@utils/calculateDistance.ts';

import Modal from '@styled/Modal';
import {Button} from '@styled/buttons';

export default function NearPosButton() {
  const {bottomSheetRef, bottomSheetSnapPoints, setBusiness, setNearByPos} =
    useStore.getState();

  const posList = useStore(state => state.posList);
  const nearByPos = useStore(state => state.nearByPos);
  const location = useStore(state => state.location);

  const [nearByModal, setNearByModal] = useState(false);

  const isNearestCarWashSet = useRef(false);

  const handleLaunchCarWash = () => {
    if (nearByPos) {
      setBusiness(nearByPos);
      navigateBottomSheet('Business', nearByPos);
      bottomSheetRef?.current?.snapToPosition(
        bottomSheetSnapPoints[bottomSheetSnapPoints.length - 2],
      );
    } else {
      setNearByModal(true);
    }
  };

  const findNearestCarWash = () => {
    if (!location || !posList?.length) return;

    let nearest: CarWashLocation | null = null;
    let minDistance = Infinity;

    for (const carWash of posList) {
      const {lat, lon} = carWash.location;
      const distance = calculateDistance(
        location.longitude,
        location.latitude,
        lon,
        lat,
      );

      if (distance < minDistance && distance <= 5) {
        minDistance = distance;
        nearest = carWash;
      }
    }

    if (nearest) {
      setNearByPos(nearest);
      isNearestCarWashSet.current = true;
    }
  };

  useEffect(() => {
    if (
      !isNearestCarWashSet.current &&
      location &&
      posList &&
      posList.length > 0
    ) {
      findNearestCarWash();
    }
  }, [location, posList]);

  return (
    <>
      <Pressable style={styles.balanceCard} onPress={handleLaunchCarWash}>
        <View style={styles.label}>
          <Text style={styles.labelText}>Моемся</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            {nearByPos?.carwashes?.length ? nearByPos.carwashes[0].name : ''}
          </Text>
          <Image
            source={require('../../../../assets/icons/small-icon.png')}
            style={styles.infoImage}
          />
        </View>
      </Pressable>
      <Modal
        visible={nearByModal}
        onClose={() => setNearByModal(false)}
        animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {
                'Предоставьте доступ к геолокации или выберите мойку на карте 🚗'
              }
            </Text>
            <View style={styles.actionButtons}>
              <View>
                <Button
                  onClick={() => setNearByModal(false)}
                  label={'Закрыть'}
                  color="blue"
                  width={129}
                  height={42}
                  fontSize={18}
                  fontWeight="600"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: BLUE,
    borderRadius: 22,
    height: dp(90),
    flex: 1,
    marginRight: dp(8),
    flexDirection: 'column',
    padding: dp(16),
  },
  label: {
    paddingBottom: dp(8),
  },
  labelText: {
    color: WHITE,
    fontSize: dp(16),
    fontWeight: '700',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: dp(10),
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  infoImage: {
    width: 30,
    height: 30,
  },
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
    justifyContent: 'center',
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
    justifyContent: 'space-between',
    paddingTop: dp(27),
  },
});
