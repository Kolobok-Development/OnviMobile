import React, {useState, useEffect, useMemo} from 'react';
import {View, Dimensions, Platform, PermissionsAndroid} from 'react-native';
import MapboxGL, {UserLocation, LocationPuck} from '@rnmapbox/maps';
import Marker from './Marker';
import useStore from '../../state/store.ts';
import useSWR from 'swr';
import {getPOSList} from '@services/api/pos';
import {throttle} from 'lodash';

MapboxGL.setAccessToken(
  'sk.eyJ1Ijoib25pdm9uZSIsImEiOiJjbTBsN2Q2MzIwMnZ0MmtzN2U5d3lycTJ0In0.J57w_rOEzH4Mijty_YXoRA',
);

const Map = React.memo(({bottomSheetRef, cameraRef, userLocationRef}: any) => {
  const {posList, setPosList, location, setLocation} = useStore.getState();
  const {error, data} = useSWR(['getPOSList'], () => getPOSList({}), {
    revalidateOnFocus: false,
  });

  console.log('MAP rerender: ', posList);

  useEffect(() => {
    if (data && data.businessesLocations) {
      setPosList(data.businessesLocations);
    }
  }, [data]);

  if (error) {
    console.error('Error fetching POS List:', error);
  }

  const [zoomedIn, setZoomedIn] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const memoizedBusinesses = useMemo(
    () =>
      posList && posList.length
        ? posList.map(business => (
            <Marker
              key={`${business.carwashes[0].id}-${business.location.lat}-${business.location.lon}`}
              coordinate={[business.location.lon, business.location.lat]}
              locationRef={userLocationRef}
              bottomSheetRef={bottomSheetRef}
              business={business}
            />
          ))
        : [],
    [posList],
  );

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          setHasLocationPermission(
            granted === PermissionsAndroid.RESULTS.GRANTED,
          );
        }
      } catch (err) {
        console.error('Error checking or requesting location permission:', err);
      }
    };

    requestLocationPermission();
  }, []);

  const onUserLocationUpdateThrottled = useMemo(
    () =>
      throttle(trhottleLocation => {
        const {latitude: lat, longitude: long} = trhottleLocation.coords;
        userLocationRef.current = {lat, lon: long};
        setLocation({latitude: lat, longitude: long});
      }, 1000),
    [userLocationRef],
  );

  useEffect(() => {
    if (
      !zoomedIn &&
      location &&
      typeof location.latitude !== 'undefined' &&
      typeof location.longitude !== 'undefined'
    ) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 10,
      });
      setZoomedIn(true);
    }
  }, [location, zoomedIn]);

  return (
    <View
      style={{
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        position: 'absolute',
      }}>
      <MapboxGL.Camera
        ref={cameraRef}
        zoomLevel={100}
        pitch={1}
        animationMode="flyTo"
        animationDuration={6000}
        followUserLocation={false}
      />
      <MapboxGL.MapView
        style={{flex: 1}}
        zoomEnabled={true}
        scaleBarEnabled={false}
        styleURL={'mapbox://styles/mapbox/light-v11'}
        preferredFramesPerSecond={120}>
        {memoizedBusinesses}
        <UserLocation
          visible={hasLocationPermission}
          showsUserHeadingIndicator={true}
          requestsAlwaysUse={true}
          onUpdate={onUserLocationUpdateThrottled}
          animated={true}
        />
        <LocationPuck
          puckBearing="heading"
          pulsing={{
            isEnabled: true,
            color: '#BFFA00',
            radius: 25.0,
          }}
          visible={true}
        />
      </MapboxGL.MapView>
    </View>
  );
});

export {Map};
