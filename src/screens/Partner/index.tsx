import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {Partner as PartnerType} from '../../types/api/app/types.ts';
import PartnerPlaceholder from '@screens/Partner/PartnerPlaceholder.tsx';
import {BackButton} from '@components/BackButton';
import {dp} from '@utils/dp.ts';
import Markdown from 'react-native-markdown-display';
import {PartnerIntegration} from '@screens/Partner/PartnerIntegration.tsx';

const Partner = () => {
  const route: any = useRoute();
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Партнер'>>();
  const partner: PartnerType | undefined = route.params?.data;

  /**
   * Memoize partner attributes to prevent unnecessary recomputation
   */
  const partnerAttributes = useMemo(() => partner?.attributes, [partner]);

  /**
   * Memoize the markdown content to avoid re-rendering
   */
  const markdownContent = useMemo(() => {
    return partnerAttributes?.content || '';
  }, [partnerAttributes]);

  /**
   * Optimize navigation function with `useCallback`
   */
  const handleGoBack = useCallback(() => {
    navigation.navigate('Партнеры');
  }, [navigation]);

  if (!partner) {
    return (
      <SafeAreaView style={styles.container}>
        <PartnerPlaceholder />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton callback={handleGoBack} />
        <Text style={styles.screenTitle}>{partnerAttributes?.name}</Text>
        <View style={{width: dp(50)}} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Image
            source={{uri: partnerAttributes?.image?.data?.attributes?.url}}
            style={styles.banner}
          />
          <View style={styles.contentHeader}>
            <View style={styles.circleImageContainer}>
              <Image
                source={{
                  uri: partnerAttributes?.partner_icon?.data?.attributes?.url,
                }}
                style={styles.circleImage}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.name}>{partnerAttributes?.name}</Text>
              <Text style={styles.description}>Кэшбек на покупку от 2 500</Text>
            </View>
          </View>

          {/* Memoized markdown content */}
          <Markdown style={{body: {color: '#000', fontSize: dp(14), paddingLeft: 16}}}>
            {markdownContent}
          </Markdown>

          {/* Partner Interaction Component */}
          <PartnerIntegration partner={partner} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollView: {flexGrow: 1, paddingBottom: dp(30)},
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  screenTitle: {fontWeight: '700', fontSize: dp(24), color: '#000'},
  content: {alignItems: 'center', marginTop: dp(15)},
  banner: {width: dp(342), height: dp(190)},
  contentHeader: {flexDirection: 'row', alignItems: 'center', padding: 16},
  circleImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  circleImage: {width: '100%', height: '100%', resizeMode: 'contain'},
  detailsContainer: {flex: 1, justifyContent: 'center'},
  name: {fontSize: dp(16), fontWeight: '600', color: '#000'},
  description: {fontSize: dp(10), color: '#000', fontWeight: '400'},
});

export {Partner};

/*
{modalVisible && (
              <View style={{flex: 1, backgroundColor: 'red'}}>
                <WebView
                  source={{
                    uri: `${modalData.redirectUrl}?token=${encodeURIComponent(
                      modalData.authToken,
                    )}`,
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  mixedContentMode="always"
                  webviewDebuggingEnabled={true} // Corrected prop name
                  onHttpAuthRequest={request => {
                    // Handle basic authentication
                    // Replace with actual domain
                    return {
                      username: 'SetPartnerstv',
                      password: 'PodpiskaOgon!',
                    };
                  }}
                  onShouldStartLoadWithRequest={request => {
                    // Prevent navigation to external URLs
                    if (!request.url.startsWith(modalData.redirectUrl)) {
                      return false;
                    }
                    return true;
                  }}
                  onMessage={event => {
                    // Handle messages from WebView
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'CLOSE') {
                      closeModal();
                    }
                  }}
                  useWebKit={true}
                  injectedJavaScriptBeforeContentStart={`
          // Initialize with auth token
          window.authToken = '${modalData.authToken}';
          true;
        `}
                />
              </View>
            )}
 */
