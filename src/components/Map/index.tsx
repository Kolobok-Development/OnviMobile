import React, {useState, useEffect, useMemo} from 'react';

import {View, Dimensions, Platform, PermissionsAndroid} from 'react-native';

import {API_URL, PUBLIC_URL, STRAPI_URL} from '@env';

import MapboxGL, {
  UserLocation,
  LocationPuck,
  UserTrackingMode,
} from '@rnmapbox/maps';

import Marker from './Marker';

import useStore from '../../state/store.ts';
import useSWR from 'swr';
import {getPOSList} from '@services/api/pos';

import { IUserLocation } from "../../state/app/AppSlice.ts"

MapboxGL.setAccessToken(
  'sk.eyJ1Ijoib25pdm9uZSIsImEiOiJjbTBsN2Q2MzIwMnZ0MmtzN2U5d3lycTJ0In0.J57w_rOEzH4Mijty_YXoRA',
);

const Map = ({bottomSheetRef, cameraRef, userLocationRef}: any) => {

  const {posList, setPosList, location, setLocation } = useStore();

  useSWR(['getPOSList'], () => getPOSList({}), {
    onError: error => {
      console.error(error);
    },
    onSuccess: data => {
      setPosList(data.businessesLocations);
    },
  });

  const [zoomedIn, setZoomedIn] = useState(false);

  useEffect(() => {
    console.log("businesses: ", posList?.length)
  }, [posList])

  const memoizedBusinesses = useMemo(
    () =>
      posList && posList.length
        ? posList.map(business => {
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
    [posList],
  );

  //Location state
  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);

  // const [userLocation, setUserLocation] = useState<IUserLocation | null>(null);

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

  // useEffect(() => {
  //   try {
  //     async function loadWashes() {
  //       await getCarWashes({})
  //         .then(data => {
  //           if (data && data.businessesLocations) {
  //             setState({
  //               ...state,
  //               businesses: data.businessesLocations,
  //             });
  //           }
  //         })
  //         .catch(err => console.log(`Error: ${err}`));
  //     }
  //
  //     if (businesses.length === 0) {
  //       loadWashes();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  const onUserLocationUpdate = async (location: any) => {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    userLocationRef.current = {lat: lat, lon: long};
    setLocation({
      latitude: lat,
      longitude: long,
    });
    // setState((prevState: any) => ({
    //   ...prevState,
    //   userLocation: {latitude: lat, longitude: long},
    // }));
  };

  useEffect(() => {
    if (!zoomedIn && location && typeof location.latitude !== "undefined" && typeof location.longitude !== "undefined") {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 10,
      });
      setZoomedIn(true);
    }
  }, [location]);

  // @ts-ignore
  return (
    <>
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
        {/* <MapboxGL.MapView
          style={{
            flex: 1,
          }}
          zoomEnabled={true}
          scaleBarEnabled={false}
          preferredFramesPerSecond={120}>
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={100}
            pitch={1}
            animationMode="flyTo"
            animationDuration={6000}
            followUserLocation={false}
          />
          {memoizedBusinesses}
          <UserLocation
            visible={hasLocationPermission}
            showsUserHeadingIndicator={true}
            requestsAlwaysUse={true}
            onUpdate={onUserLocationUpdate}
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
        </MapboxGL.MapView> */}
      </View>
    </>
  );
};

export {Map};
