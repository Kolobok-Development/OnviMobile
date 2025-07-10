import Reactotron, {networking} from 'reactotron-react-native';
import reactotronZustand from 'reactotron-plugin-zustand';
import store from './src/state/store';

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
