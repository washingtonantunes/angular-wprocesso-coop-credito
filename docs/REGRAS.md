# Regras do projeto

As duas exposições pertencem ao mesmo front de área, publicado em separado das cascas. A exposição Central só contém rotas e menu da Central; a da Cooperativa, somente os da Cooperativa. O código do produto da página de prova é `CREDITO_RURAL`. A permissão de leitura é `CREDITO_RURAL_PAGINADO_CENTRAL` ou `CREDITO_RURAL_PAGINADO_COOPERATIVA`, respectivamente.

Uma correção neste front exige build e publicação apenas desta aplicação, desde que o contrato público da UI e as versões compartilhadas continuem compatíveis. A configuração de endereços fica nas cascas. Veja [MICROFRONT.md da UI](../../angular-wprocesso-coop-ui/docs/MICROFRONT.md).
