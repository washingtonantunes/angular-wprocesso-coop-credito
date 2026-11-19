import { initFederation } from '@softarc/native-federation-orchestrator';
import { consoleLogger, globalThisStorageEntry, useShimImportMap } from '@softarc/native-federation-orchestrator/options';

initFederation({ credito: './remoteEntry.json' }, {
  ...useShimImportMap({ shimMode: true }),
  logger: consoleLogger,
  storage: globalThisStorageEntry,
  hostRemoteEntry: './remoteEntry.json',
})
  .then(() => import('./bootstrap'))
  .catch((erro) => console.error('Não foi possível iniciar o Crédito', erro));
