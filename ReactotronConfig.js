import Reactotron, {networking} from 'reactotron-react-native';
import apisaucePlugin from 'reactotron-apisauce';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import ReactotronReactNative from 'reactotron-react-native/src/reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import reactotronZustand from 'reactotron-plugin-zustand';
import store, {ZustandMMKVStorage} from './src/state/store';

const reactotron = Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(
    reactotronZustand({
      stores: [{name: 'store', store: store}],
      omitFunctionKeys: true,
    }),
  )
  .use(
    networking({
      ignoreContentTypes: /^(image)\/.*$/i,
      ignoreUrls: /\/(logs|symbolicate)$/,
    }),
  )
  .connect(); // let's connect!

export default reactotron;
