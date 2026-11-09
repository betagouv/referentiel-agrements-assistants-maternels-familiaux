# Installer

Les instructions suivantes vous permettront :
- d'exécuter l'application en local, pour faire des tests manuels ;
- de développer sur l'application.

## Prérequis

Logiciels:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/), version indiquée dans le fichier [.nvmrc](.nvmrc))
- [Docker](https://docs.docker.com/get-started/)
- [direnv](https://direnv.net/)

Il est recommandé d'utiliser un gestionnaire de versions tel que [nvm](https://github.com/nvm-sh/nvm).

## Bootstrap

Récupérer le code source en local.
```shell
git clone https://github.com/betagouv/referentiel-agrements-assistants-maternels-familiaux.git $DOSSIER
cd $DOSSIER
```

Installer les dépendances.
```shell
npm install
```

Initialiser la configuration.
```shell
cp .envrc.sample .envrc
```

Charger la configuration.
```shell
direnv allow
```

Démarrer la base de données.
```shell
docker compose up --detach --wait
```

Exécuter les tests automatisés.
```shell
npm run test
```

Exécuter les tests de bout en bout
```shell
npm start &
npm run test:end-to-end
```

## Démarrer l'application

Démarrer la base de données.
```shell
docker compose up --detach --wait
```

Créer le schéma.
```shell
npm run database:migrate
```

Démarrer l'application.
```shell
npm start
```

Appeler le healthcheck
```shell
curl http://localhost:3000/api
```

Parcourir les routes disponibles [avec Swagger](http://localhost:3000/documentation).

## Tester en local

### Jeux de données

Créer le jeu de donnée.
```shell
npm run database:seed
```

### Simuler les dépendances

L'application est cliente du RNIPP.
Pour effectuer des tests en local, sans disposer de connexion au RNIPP, vous pouvez utiliser le fake.
Il dispose [de données de test](./tests/fake/seeds/person.js).

Créez le schéma et les jeux de données.
```shell
npm run fake:database:migrate
npm run fake:database:seed
```

Vérifiez les données créées.
```shell
psql --host localhost --username postgres --command="select * from pajemploi.agrement"
```

Démarrez les fakes. 
```shell
npm run fake:rnipp:start
npm run fake:pajemploi:start
```

Vérifiez qu'ils répondent par une 200.
```shell
curl -i \
  --header "Content-Type: application/json" \
  --request PUT \
  --data '{"nom":"Dorothy"}' \
  "http://localhost:3001/rnipp/person"
  
curl -i \
  --header "Content-Type: application/json" \
  --request PUT \
  --data '{"nom":"Dorothy"}' \
  "http://localhost:3002/pajemploi/agrement"
```

Les fakes font l'objet de tests automatisés en local et sur la CI, mais ne sont pas disponibles sur le PaaS.
Il faudrait soit ajouter un nginx devant, soit créer une application séparée, Scalingo n'acceptant qu'un conteneur web par [Procfile](Procfile).

## Développer

Avant de développer, lire les règles [dans ce guide](CONTRIBUER.md).

### Configurer l'IDE

#### Variables d'environnement

Pour disposer des variables d'environnement :
- soit lancez votre IDE depuis un terminal ;
- soit configurez manuellement les variables dans l'environnement d'exécution de votre IDE ;
- soit utilisez [un plugin](https://plugins.jetbrains.com/plugin/19275-better-direnv).

#### Framework de test

Dans l'environnement d'exécution Mocha, ajouter l'option `--exit`, présente dans [.mocharc.json](.mocharc.json).

### Créer une migration

Pour l'application.
```shell
npx knex --cwd ./src/database migrate:make $NOM_MIGRATION
```

Pour les fakes.
```shell
npx knex --cwd ./tests/fake/database migrate:make $NOM_MIGRATION
```

### Supprimer le schéma

Pour supprimer les tables et les données de test.
```shell
docker compose down --volumes
```

## Intégrer sur Github

La configuration Github recommandée utilise les merge commit, bien que ce soit optionnel.
Par contre, la merge queue est obligatoire pour la mise à jour avec Renovate, afin de profiter de l'auto-merge.

### Configurer merge

Créez une ruleset sur la branche par défaut.

Décocher l'option `Require linear history`.

Cochez l'option `Require merge queue`.
Sélectionnez l'option `Merge commit`.
Cochez l'option `Require all queue entries to pass required checks`.

Cochez l'option `Require status checks to pass` et `Require branches to be up to date before merging`.

Cochez l'option `Require a pull request before merging`.

Vérifiez que la merge queue [a été créée](https://github.com/betagouv/referentiel-agrements-assistants-maternels-familiaux/queue/main).

### Tests automatisés

Les tests automatisés sont déclenchés :
- à chaque création de pull request ; 
- à chaque merge sur la branche par défaut.

Pour cela, créez un environnement `main`.

Ajoutez-y les variables d'environnement :
- de l'API, voir [.envrc](.envrc.sample);
- des fakes, voir [.envrc](.envrc.sample).

Déclenchez manuellement [l'action](https://github.com/betagouv/referentiel-agrements-assistants-maternels-familiaux/actions) et vérifiez qu'elle sorte en succès.

Pour plus de détails, voir [l'action](.github/workflows/test.yml)

## Déployer sur Scalingo

Une fois configuré, le déploiement sur Scalingo se fait :
- lors de la création d'une pull request, sur la review application ;
- lors du merge d'une pull request sur `main`, sur l'environnement de référence.

Le déploiement sur Scalingo se fait uniquement si la CI s'achève avec succès.

### Application

Activez l'intégration SCM.

Ajoutez les variables d'environnement, voir [.envrc](.envrc.sample).

Ajouter un addon PostgreSQL.

Effectuez un premier déploiement.

Les [migrations de la base de données](src/database/main/migrations) sont exécutées automatiquement par le hook de [postdeploy](Procfile) lors du déploiement.

### Review application

Activez les review application.

Elles héritent automatiquement des variables d'environnement.
L'ajout de l'addon PostgreSQL est effectué automatiquement grâce au fichier [dédié](scalingo.json).

> Child applications clone some information from the parent app:
>    the container formation
>    the stack
>    the environment variables 

> Databases content and other addons content won’t be copied from the parent application to its child applications.

[Référence](https://doc.scalingo.com/platform/app/review-apps#addons-collaborators-and-environment-variables)

Les [jeux de test manuels](src/database/seeds) (seeds) sont créés [automatiquement](scalingo.json) lors du premier déploiement.

Pour tester des montées et descentes de migrations, connectez-vous en CLI. 
```shell
scalingo --app $NOM_APPLICATION-pr$NUMERO_PULL_REQUEST run bash
```

## Monitorer sur Sentry

Créer un projet Sentry et récupérer le DSN.

Renseigner la variable d'environnement `$SENTRY_DSN` avec l'URL du DSN, elle sera utilisée dans [le setup Sentry](instrument.cjs).

Pour tester, appeler la route non authentifiée `/api/error`.
```shell
curl -i "http://localhost:3000/api/error"
```

## Mettre à jour automatiquement les dépendances

Installer l'application Renovate sur GitHub.

La [configuration dédiée](renovate.json):
- affiche le [dependency dashboard](https://github.com/betagouv/referentiel-agrements-assistants-maternels-familiaux/issues/28) ;
- groupe toutes les montées de version des dépendances de développement, et les merge (si la CI passe) ;
- groupe toutes les montées de version non-majeures des dépendances, et les merge (si la CI passe).
