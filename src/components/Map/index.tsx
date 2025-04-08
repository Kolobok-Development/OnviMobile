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

MapboxGL.setAccessToken(
  'sk.eyJ1Ijoib25pdm9uZSIsImEiOiJjbTBsN2Q2MzIwMnZ0MmtzN2U5d3lycTJ0In0.J57w_rOEzH4Mijty_YXoRA',
);

const DEFAULT_LOCATION = {
  longitude: 37.618423,
  latitude: 55.751244,
};

const Map = forwardRef<CameraReference, any>(({userLocationRef}: any, ref) => {
  const {posList, setPosList, location, setLocation} = useStore.getState();
  const {error, data} = useSWR(['getPOSList'], () => getPOSList({}), {
    revalidateOnFocus: false,
  });

  const [locationFound, setLocationFound] = useState(false);
  // Track if initial centering has been performed to prevent multiple animations
  const initialCenteringRef = React.useRef(false);

  const cameraRef = React.useRef<CameraRef>(null);

  useEffect(() => {
    if (data && data.businessesLocations) {
      setPosList(data.businessesLocations);
    }
  }, [data]);

  if (error) {
    console.error('Error fetching POS List:', error);
  }

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
          } else {
            console.error('Location permission denied');
          }
        } else {
          setHasLocationPermission(true);
        }
      } catch (err) {
        console.error('Error checking or requesting location permission:', err);
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    console.log('PERMISSION', hasLocationPermission);
  }, [hasLocationPermission]);

  const onUserLocationUpdateThrottled = useMemo(
    () =>
      throttle(userLocation => {
        console.log('CALLED');
        const {latitude: lat, longitude: lon} = userLocation.coords;
        setLocation({latitude: lat, longitude: lon});

        // Only center the map on first location update, using our ref to prevent multiple animations
        if (!initialCenteringRef.current) {
          setLocationFound(true);
          initialCenteringRef.current = true;

          console.log('First location received, centering map to:', {lat, lon});

          // Immediately center the camera on first location update
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: [lon, lat],
              zoomLevel: 14,
              pitch: 1,
              animationMode: 'flyTo',
              animationDuration: 300, // Faster animation for initial centering
            });
          }
        }
      }, 1000),
    [locationFound, setLocation],
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

  // Remove the effect that depends on locationFound since we now center the map
  // immediately when the first location update comes in

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
          animationDuration={1000}
          followUserLocation={false}
          centerCoordinate={
            // Use user location if available, otherwise use default
            location
              ? [location.longitude, location.latitude]
              : [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude]
          }
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
