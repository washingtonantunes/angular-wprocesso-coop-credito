import { shareAll, withNativeFederation } from '@angular-architects/native-federation-v4/config';

const singleton = { singleton: true, strictVersion: true, requiredVersion: 'auto', build: 'package' };

export default withNativeFederation({
  name: 'credito',
  exposes: { './central': './src/app/central/central.exposicao.ts', './cooperativa': './src/app/cooperativa/cooperativa.exposicao.ts' },
  shared: shareAll(singleton, {
    overrides: {
      'angular-wprocesso-coop-ui': {
        singleton: true,
        strictVersion: true,
        requiredVersion: '0.0.1',
        version: '0.0.1',
        build: 'package',
      },
    },
  }),
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
  features: { denseChunking: true },
});

