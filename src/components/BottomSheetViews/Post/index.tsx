import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, Linking} from 'react-native';

import {dp} from '../../../utils/dp';

import {useRoute, useNavigation} from '@react-navigation/native';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {horizontalScale, moderateScale} from '../../../utils/metrics';

import Markdown from 'react-native-markdown-display';
import {Button} from '@styled/buttons';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {NewsPost} from '../../../api/AppContent/types';

import useStore from "../../../state/store"

const Post = () => {
  const route: any = useRoute();

  const [post, setPost] = useState<NewsPost | null>(null);
  const navigation = useNavigation();

  const { isBottomSheetOpen: isOpened } = useStore()

  useEffect(() => {
    if (route && route.params && route.params.data && route.params.data) {
      setPost(route.params.data);
    }
  }, []);

  const PostPlaceholder = () => {
    return (
      <SkeletonPlaceholder borderRadius={4}>
        <View>
          <SkeletonPlaceholder.Item
            marginTop={dp(30)}
            width={'100%'}
            height={dp(150)}
            borderRadius={dp(25)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
        </View>
      </SkeletonPlaceholder>
    );
  };

  return (
    <BottomSheetScrollView
      contentContainerStyle={{...styles.container, backgroundColor: 'white'}}
      nestedScrollEnabled={true}
      scrollEnabled={isOpened}>
      <View
        style={{display: 'flex', flexDirection: 'column', paddingTop: dp(20)}}>
        {!post ? (
          <PostPlaceholder />
        ) : (
          <>
            <Image
              source={{uri: post.attributes.image.data.attributes.url}}
              style={{
                width: '100%',
                flex: 1,
                aspectRatio:
                  post.attributes.image.data.attributes.width /
                  post.attributes.image.data.attributes.height,
                borderRadius: dp(25),
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: dp(16),
              }}>
              <Text
                style={{fontSize: dp(22), fontWeight: '700', color: '#000'}}>
                {post.attributes.title}
              </Text>
              {/* @ts-ignore */}
              <Markdown
                style={{
                  body: {color: '#000', fontSize: dp(15)},
                  link: {color: 'blue'},
                }}>
                {post.attributes.content}
              </Markdown>
              <View
                style={{
                  flex: 1,
                  paddingTop: dp(20),
                  paddingBottom: dp(100),
                  alignItems: 'center',
                }}>
                {post.attributes.button_title ? (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <Button
                      label={post.attributes.button_title}
                      width={125}
                      height={dp(35)}
                      onClick={() => {
                        if (post.attributes.url) {
                          Linking.openURL(post.attributes.url);
                        } else if (post.attributes.screen_redirect) {
                          //@ts-ignore
                          navigation.navigate(
                            post.attributes.screen_redirect,
                            route.params,
                          );
                        }
                      }}
                      color="blue"
                      fontSize={dp(12)}
                    />
                    <Button
                      label={'Закрыть'}
                      color={'lightGrey'}
                      width={125}
                      height={35}
                      fontSize={dp(12)}
                      onClick={() => {
                        navigation.goBack();
                      }}
                    />
                  </View>
                ) : (
                  <Button
                    label={'Закрыть'}
                    color={'lightGrey'}
                    width={150}
                    height={50}
                    onClick={() => {
                      navigation.goBack();
                    }}
                  />
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: moderateScale(38),
    paddingLeft: horizontalScale(22),
    paddingRight: horizontalScale(22),
    backgroundColor: 'white',
    display: 'flex',
    paddingTop: dp(10),
    paddingBottom: dp(100),
  },
});

export {Post};
