# Contribuer

Chaque modification est effectuée sur une branche :
- partant de la branche par défaut du repository;
- son nom est en français;
- son nom commence par un verbe;
- son nom ne comporte aucun espace, ni caractère accentué.

Ex: `tracer-consultation-historique-agrement`.

Sur une branche, la modification est effectuée : 
- avec des commits atomiques ;
- dont le nom respecte la convention [conventional commit](https://www.conventionalcommits.org).

Ex: `feat(api): lier l'utilisateur à un département`.

La modification est testée automatiquement.

Elle est soumise par une Pull request, rédigée en français, [en suivant le template](./.github/pull_request_template.md).

La Pull request exécute automatiquement les tests automatisés (CI) avec Github Actions.

La Pull request donne lieu à la création d'une review application.
Chaque push sur la pull request redéploie les modifications, uniquement si la CI finit en succès.

L'intégration des modifications (merge de la Pull Request) :
- a pour pré-requis le passage des tests automatisés avec succès ;
- préserve les commits (no squash).

## Backend

Les dépendances sont toutes déclarées, et toutes les dépendances déclarées sont utilisées [(référence)](knip.json).

La casse des noms de fichiers et de dossier [est vérifiée](.ls-lint.yml).

La modification :
- est formatée [(configuration)](.oxfmtrc.json);
- suit les règles de lint [(configuration)](eslint.config.js);

Les règles de lint suivent le set `recommended`, et quelques règles supplémentaires :
- [code Js](https://eslint.org/docs/latest/rules/) ;
- [ordre des imports](https://github.com/lydell/eslint-plugin-simple-import-sort/) ;
- [commentaires de linter](https://eslint-community.github.io/eslint-plugin-eslint-comments/rules) ;
- [runner de test](https://github.com/lo1tuma/eslint-plugin-mocha#rules) ;
- [assertion de test](https://github.com/Turbo87/eslint-plugin-chai-expect#rules) ;
- [sécurité Node](https://eslint.interlace.tools/docs/security/plugin-node-security/) - set `strict`;
- [code Yaml](https://ota-meshi.github.io/eslint-plugin-yml/rules/).

La configuration est passé aux CLI utilisé par  `npm` par des dotfile plutôt que par des options, par exemple [.mocharc.json](.mocharc.json).

### Langue, encodage, casse

Le nom des variables, fonctions, des tests (bref, tout sauf le langage de programmation) sera en français.

Le nom des fichiers et des dossiers sera de préférence en `kebab-case`, sans espace, [sauf exception](.ls-lint.yml) imposée par une librairie. Leur encodage sera en UTF-8.

Le nom des variables et des fonctions ne comportera pas de caractères accentués ou spéciaux. Par contre, utilisez les caractères accentués dans les descriptions de test (ex: `describe("si l'utilisateur est identifié")`).

### Tests automatisés

Les tests sont découpés en [3 sections](http://xunitpatterns.com/Four%20Phase%20Test.html), explicités avec des commentaires.
```js
it('doit retourner BAD_REQUEST (400)', async function () {
    // given
    
    // when 
    
    // then
})
```

Pour faciliter la lecture des compte-rendus d'exécution, le contenu du fichier de test est une section contenant :
- le type de test (unitaire, intégration, bout-en-bout);
- le type de composant testé (route, repository);
- le nom du composant.
```js
describe(`Intégration | Route | Délivrance d'agrément`, function () {
  
})
```