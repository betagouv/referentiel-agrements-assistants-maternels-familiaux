# Contribuer

Chaque modification est effectuée sur une branche :
- partant de la branche par défaut du repository;
- son nom est en français.

Sur une branche, la modification est effectuée : 
- avec des commits atomiques ;
- dont le nom respecte la convention [conventional commit](https://www.conventionalcommits.org).

La modification est testée automatiquement.

Elle est soumise par une Pull request, rédigée en français.

L'intégration des modifications (merge de la Pull Request) :
- a pour pré-requis le passage des tests automatisés avec succès ;
- préserve les commits (no squash).

## backend

Les dépendances sont toutes déclarées, et toutes les dépendances déclarées sont utilisées [(référence)](knip.json).

La casse des noms de fichiers et de dossier [est vérifiée](.ls-lint.yml).

La modification :
- est formatée [(configuration)](.oxfmtrc.json);
- suit les règles de lint [(configuration)](eslint.config.js);

Les règles de lint suivent le set `recommended`, et quelques règles supplémentaires :
- [code Js](https://eslint.org/docs/latest/rules/)
- [ordre des imports](https://github.com/lydell/eslint-plugin-simple-import-sort/)
- [commentaires de linter](https://eslint-community.github.io/eslint-plugin-eslint-comments/rules)
- [test runner](https://github.com/lo1tuma/eslint-plugin-mocha#rules) ;
- [test assertion](https://github.com/Turbo87/eslint-plugin-chai-expect#rules) .
- [code Yaml](https://ota-meshi.github.io/eslint-plugin-yml/rules/)