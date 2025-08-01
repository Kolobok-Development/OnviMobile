import React, {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {View, Dimensions, Platform, PermissionsAndroid} from 'react-native';
import MapboxGL, {UserLocation, LocationPuck} from '@rnmapbox/maps';
import Marker from './Marker';
import useStore from '../../state/store.ts';
import useSWR from 'swr';
import {getPOSList} from '@services/api/pos';
import {throttle} from 'lodash';

import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';

export type CameraReference = {
  setCameraPosition: (val?: {longitude: number; latitude: number}) => void;
};

const DEFAULT_LOCATION = {
  longitude: 37.618423,
  latitude: 55.751244,
};

const Map = forwardRef<CameraReference, any>(({userLocationRef}: any, ref) => {
  const {posList, setPosList, location, setLocation} = useStore.getState();
  const {data} = useSWR(['getPOSList'], () => getPOSList({}), {
    revalidateOnFocus: false,
  });

  const [locationFound, setLocationFound] = useState(false);

  const cameraRef = React.useRef<CameraRef>(null);
  const [cameraSet, setCameraSet] = useState(false);

  useEffect(() => {
    if (data && data.businessesLocations) {
      setPosList(data.businessesLocations);
    }
  }, [data]);

  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const memoizedBusinesses = useMemo(
    () =>
      posList && posList.length
        ? posList.map(business => (
            <Marker
              key={`${business.carwashes[0].id}-${business.location.lat}-${business.location.lon}`}
              coordinate={[business.location.lon, business.location.lat]}
              locationRef={userLocationRef}
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
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasLocationPermission(true);
          }
        } else {
          setHasLocationPermission(true);
        }
      } catch (err) {}
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (!cameraSet && hasLocationPermission && locationFound && location) {
      cameraRef.current?.setCamera({
        centerCoordinate: [
          location?.longitude ?? DEFAULT_LOCATION.longitude,
          location?.latitude ?? DEFAULT_LOCATION.latitude,
        ],
        zoomLevel: 14,
        pitch: 1,
        animationMode: 'flyTo',
        animationDuration: 1,
      });
      setCameraSet(true);
    }
  }, [hasLocationPermission, locationFound, location, cameraSet]);

  const onUserLocationUpdateThrottled = useMemo(
    () =>
      throttle(userLocation => {
        if (!locationFound) {
          setLocationFound(true);
        }
        const {latitude: lat, longitude: lon} = userLocation.coords;
        setLocation({latitude: lat, longitude: lon});
      }, 1000),
    [setLocation],
  );

  const setCameraPosition = (val?: {longitude: number; latitude: number}) => {
    cameraRef.current?.setCamera({
      centerCoordinate: val
        ? [val.longitude, val.latitude]
        : [
            location?.longitude ?? DEFAULT_LOCATION.longitude,
            location?.latitude ?? DEFAULT_LOCATION.latitude,
          ],
      zoomLevel: 14,
      pitch: 1,
      animationMode: 'flyTo',
      animationDuration: 1,
    });
  };

  useImperativeHandle(ref, () => ({
    setCameraPosition: setCameraPosition,
  }));

  useEffect(() => {
    if (locationFound) {
      setCameraPosition();
    }
  }, [locationFound]);

  return (
    <View
      style={{
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        position: 'absolute',
      }}>
      <MapboxGL.MapView
        style={{flex: 1}}
        zoomEnabled={true}
        scaleBarEnabled={false}
        styleURL={'mapbox://styles/mapbox/light-v11'}
        preferredFramesPerSecond={120}>
        {memoizedBusinesses}
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          pitch={1}
          animationMode="flyTo"
          animationDuration={4000}
          followUserLocation={false}
          centerCoordinate={[
            DEFAULT_LOCATION.longitude,
            DEFAULT_LOCATION.latitude,
          ]}
        />
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
