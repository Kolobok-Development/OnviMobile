import React, {useState, useCallback, useEffect} from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import {Button} from '@styled/buttons';
import PromoModal from '@components/PromoModal';
import {Campaign, Partner as PartnerType} from '../../types/api/app/types';
import {getGazpromAuthToken} from '@services/api/partners';
import {dp} from '@utils/dp.ts';
import useSWRMutation from 'swr/mutation';
import Toast from 'react-native-toast-message';
import RNGPBonus from '@setpartnerstv/react-native-gpbonus-sdk';
import useStore from '../../state/store';


interface PartnerIntegrationProps {
  partner: Campaign;
}

const PartnerIntegration: React.FC<PartnerIntegrationProps> = ({partner}) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [webViewError, setWebViewError] = useState(null);
  const [url, setUrl] = useState<string | null>(null);

  const {referenceToken, setReferenceToken, gazpromToken, setGazpromToken} = useStore.getState();

  // Fetch auth token *only* for redirect integration
  // const isRedirectIntegration =
  //   partner.attributes.integration_type === 'redirect';

  // Show error toast
  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'customErrorToast',
      text1: message,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  //
  const {
    trigger,
    isMutating,
    data: partnerData,
  } = useSWRMutation('getPartnerAuthToken', () => getGazpromAuthToken(), {
    onError: err => {
      console.log('err', err);
      showErrorToast('Не получилось открыть виджет...');
      setModalVisible(false);
    },
  });

  useEffect(() => {
    console.log(partnerData);
  }, [partnerData]);
  /**
   * useEffect to wait for authentication before setting authToken
   */
  useEffect(() => {
    if (gazpromToken) {
      setAuthToken(gazpromToken);
      setGazpromToken(null);      
    } else {
      if (!isMutating && partnerData?.token) {
        setAuthToken(partnerData.token);
      }
    }
  }, [isMutating, partnerData]);

  /**
   * Optimized function to handle activation
   */
  const handleActivation = useCallback(() => {
    // if (isRedirectIntegration) {
      trigger()
        .then(data => {
          setAuthToken(data?.token);
          const queryParams = {
            utm_source: 'moy-ka_ds',
            utm_medium: 'partner_widget',
            utm_campaign: 'online',
            utm_content: 'mobapp',
          };

          const queryString = Object.keys(queryParams)
            .map(
              key =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                  queryParams[key],
                )}`,
            )
            .join('&');

          // const widgetUrlWithParams = `${partner.attributes.itegration_data?.url}?${queryString}`;
          const widgetUrlWithParams = `${partner.attributes.url}?${queryString}`;
          console.log('URL ++++++ ', widgetUrlWithParams);
          setUrl(widgetUrlWithParams);
        })
        .catch(err => {
          console.log('err: ', err);
          showErrorToast('Не получилось открыть виджет...');
          setModalVisible(false);
        });
    // }
    setModalVisible(true);
  // }, [authToken, isRedirectIntegration]);
  }, [authToken]);

  /**
   * Optimized function to close modal
   */
  const handleClose = useCallback(() => {
    setModalVisible(false);
    if (webViewError) {
      showErrorToast('Партнерский виджет не доступен');
    }
  }, []);

  useEffect(() => {
    console.log('URL TO GAZPROM');
    console.log(url);
    if (referenceToken) {
      handleActivation();
      setReferenceToken(null);
    }
    
  }, [url]);

  /**
   * Handle web
   */
  const handleWebViewError = useCallback((error: any) => {
    console.error('WebView Error:', error);
    setWebViewError(error);
    setModalVisible(false);
    showErrorToast(`Не удалось загрузить контент партнера: ${error}`);
  }, []);

  return (
    <View style={{paddingTop: dp(30)}}>
      <Button
        label={partner.attributes.button_title}
        width={dp(150)}
        color="blue"
        fontSize={14}
        onClick={handleActivation}
      />

      {/* Show Promo Modal for `input` & `promo_code` */}
      {/* {partner.attributes.integration_type !== 'redirect' && (
        <PromoModal
          isVisible={modalVisible}
          type={partner.attributes.integration_type}
          title={partner.attributes.name}
          content={
            partner.attributes.integration_type === 'promo_code'
              ? 'Use this promo code'
              : partner.attributes.itegration_data?.action_text
          }
          promoCodeData={partner.attributes.itegration_data?.promo_code}
          inputData={
            partner.attributes.integration_type === 'input'
              ? {placeholder: partner.attributes.itegration_data?.placeholder}
              : undefined
          }
          buttonText="Activate"
          onClose={handleClose}
        />
      )} */}

      {/* WebView for `redirect` integration type - Opens only when AuthToken is Ready */}
      {/* {isRedirectIntegration && modalVisible && authToken && ( */}
      { modalVisible && authToken && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          <RNGPBonus
            // widgetUrl={url ? url : partner.attributes.itegration_data?.url}
            widgetUrl={url ? url : partner.attributes.url}
            token={authToken}
            checkExternalUrl={false}
            onWidgetClose={handleClose}
            webviewDebuggingEnabled={true}
            printDebugInfo={true}
            basicAuthCredential={{
              username: 'SetPartnerstv',
              password: 'PodpiskaOgon!',
            }}
            onError={error => handleWebViewError(error.nativeEvent.description)}
            // onHttpError={error =>
            //   handleWebViewError(`HTTP Error: ${error.nativeEvent.statusCode}`)
            // }
            onLoadEnd={event => {
              if (event.nativeEvent.loading) {
                return;
              }
              if (event.nativeEvent.title === 'about:blank') {
                handleWebViewError('Blank page loaded');
              }
            }}
          />
        </Modal>
      )}

      {/* Show Loading UI if we are still fetching token */}
      {/* {isRedirectIntegration && modalVisible && !authToken && ( */}
      { modalVisible && !authToken && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          {!webViewError && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </Modal>
      )}
    </View>
  );
};

export {PartnerIntegration};
