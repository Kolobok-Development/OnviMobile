import React, {useState, useEffect, useMemo} from 'react';

import {View, Dimensions, Platform, PermissionsAndroid} from 'react-native';

import {API_URL, PUBLIC_URL, STRAPI_URL} from '@env';

import {useAppState} from '@context/AppContext';

import MapboxGL, {UserLocation, LocationPuck} from '@rnmapbox/maps';

import Marker from './Marker';

import axios from 'axios';
import {getCarWashes} from '../../api/AppContent/appContent.ts';

MapboxGL.setAccessToken(
  'sk.eyJ1Ijoic2F2bmlrYXIiLCJhIjoiY2xtbnR3N2gzMHN3ZTJybzFua3dmMGt0ZCJ9.IIGLQeIqe1C906g788mRdg',
);

interface IUserLocation {
  latitude: number;
  longitude: number;
}

const DEFAULT_COORDINATES: IUserLocation = {
  latitude: 55.7558,
  longitude: 37.6176,
};

const Map = ({bottomSheetRef, cameraRef, userLocationRef}: any) => {
  const {state, setState} = useAppState();
  const businesses = state.businesses;

  const memoizedBusinesses = useMemo(
    () =>
      businesses && businesses.length
        ? businesses.map(business => {
            return (
              <Marker
                key={`${business.carwashes[0].id}-${business.location.lat}-${business.location.lon}`}
                coordinate={[business.location.lon, business.location.lat]}
                locationRef={userLocationRef}
                bottomSheetRef={bottomSheetRef}
                business={business}
              />
            );
          })
        : [],
    [businesses],
  );

  useEffect(() => {
    console.log(`Businesses change --->, ${JSON.stringify(state.businesses)}`);
  }, [state.businesses]);

  //Location state
  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);
  const [userLocation, setUserLocation] =
    useState<IUserLocation>(DEFAULT_COORDINATES);

  //Permission Request
  // Check and request location permissions
  useEffect(() => {
    // Check and request location permissions
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          setHasLocationPermission(
            granted === PermissionsAndroid.RESULTS.GRANTED,
          );
        } else {
        }
      } catch (error) {
        console.error(
          'Error checking or requesting location permission:',
          error,
        );
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    try {
      async function loadWashes() {
        await getCarWashes({})
          .then(data => {
            if (data && data.businessesLocations) {
              setState({
                ...state,
                businesses: data.businessesLocations,
              });
            }
          })
          .catch(err => console.log(`Error: ${err}`));
      }

      if (businesses.length === 0) {
        loadWashes();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onUserLocationUpdate = async (location: any) => {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    userLocationRef.current = {lat: lat, lon: long};
    setUserLocation({
      latitude: lat,
      longitude: long,
    });

    cameraRef.current.setCamera({
      centerCoordinate: [long, lat],
      zoomLevel: 15,
    });
  };

  // @ts-ignore
  return (
    <>
      <View
        style={{
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          position: 'absolute',
        }}>
        <MapboxGL.MapView
          style={{
            flex: 1,
          }}
          zoomEnabled={true}
          scaleBarEnabled={false}
          preferredFramesPerSecond={120}>
          <MapboxGL.Camera
            centerCoordinate={[userLocation.longitude, userLocation.latitude]}
            zoomLevel={100}
            pitch={1}
            ref={cameraRef}
            animationMode="flyTo"
            animationDuration={6000}
          />
          {memoizedBusinesses}
          <UserLocation
            visible={hasLocationPermission}
            requestsAlwaysUse={true}
            minDisplacement={2}
            androidRenderMode={'compass'}
            showsUserHeadingIndicator={true}
            animated={true}
            onUpdate={onUserLocationUpdate}
          />
          {Platform.OS === 'ios' && (
            <LocationPuck
              puckBearing="heading"
              scale={1}
              pulsing={{isEnabled: false}}
              visible={true}
            />
          )}
        </MapboxGL.MapView>
      </View>
    </>
  );
};

export {Map};
