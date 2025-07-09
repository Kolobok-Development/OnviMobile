import {Meta} from '../../types/models/User.ts';

export const hasMetaDataChanged = (
  localMeta: Meta,
  remoteMeta: Meta,
): boolean => {
  console.log('Comparing deviceId:', localMeta.deviceId, remoteMeta.deviceId);
  console.log('Comparing model:', localMeta.model, remoteMeta.model);
  console.log('Comparing name:', localMeta.name, remoteMeta.name);
  console.log('Comparing platform:', localMeta.platform, remoteMeta.platform);
  console.log(
    'Comparing platformVersion:',
    localMeta.platformVersion,
    remoteMeta.platformVersion,
  );
  console.log(
    'Comparing manufacturer:',
    localMeta.manufacturer,
    remoteMeta.manufacturer,
  );
  console.log('Comparing appToken:', localMeta.appToken, remoteMeta.appToken);
  return (
    localMeta.deviceId !== remoteMeta.deviceId ||
    localMeta.model !== remoteMeta.model ||
    localMeta.name !== remoteMeta.name ||
    localMeta.platform !== remoteMeta.platform ||
    localMeta.platformVersion !== remoteMeta.platformVersion ||
    localMeta.manufacturer !== remoteMeta.manufacturer ||
    localMeta.appToken !== remoteMeta.appToken
  );
};
