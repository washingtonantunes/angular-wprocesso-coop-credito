# Ambiente e execução

Angular 20.3, PrimeNG 20.4, RxJS 7.8 e Native Federation 20.3.12, alinhados às cascas. A UI comum é consumida pelo pacote compilado em `../angular-wprocesso-coop-ui/dist/angular-wprocesso-coop-ui`.

Na primeira instalação, rode `npm install` e `npm run build` na UI, depois `npm install` nesta pasta. Para desenvolver, deixe `npm run watch` ativo na UI e execute `npm run start:dev` aqui. O servidor do remoto usa a porta 4202. `npm run build` gera `dist/angular-wprocesso-coop-credito/browser/remoteEntry.json` e os chunks da aplicação.

De `wprocesso-coop/docker-wprocesso-coop/`, `docker compose up --build -d` sobe MySQL, Redis, os três backs e os três fronts. Após uma correção somente nesta área, use `docker compose up -d --build --no-deps front-credito`. Ver o `README.md` de lá.
