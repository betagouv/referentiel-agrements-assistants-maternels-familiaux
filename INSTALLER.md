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

## Démarrer l'application

Démarrer la base de données.
```shell
docker compose up --detach --wait
```

Démarrer l'application.
```shell
npm start
```

Parcourir les routes disponibles [avec Swagger](http://localhost:3000/documentation).

## Développer

Avant de développer, lire les règles [dans ce guide](CONTRIBUER.md).

Pour disposer des variables d'environnement :
- soit lancez votre IDE depuis un terminal ;
- soit configurez manuellement les variables dans l'environnement d'exécution de votre IDE ;
- soit utilisez [un plugin](https://plugins.jetbrains.com/plugin/19275-better-direnv).

## Tester sur Github

Configurée automatiquement par le fichier [dédié](.github/workflows/test.yml).

Créez un environnement `main`.

Ajoutez-y les variables d'environnement, voir [.envrc](.envrc.sample)

## Déployer sur Scalingo

### Application

Activez l'intégration SCM.

Ajoutez les variables d'environnement, voir [.envrc](.envrc.sample).

Ajouter un addon PostgreSQL.

Effectuez un premier déploiement.

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

### Simuler le RNIPP

L'application est cliente du RNIPP. 
Pour effectuer des tests en local, sans disposer de connexion au RNIPP, vous pouvez utiliser le fake.
Il dispose [de données de test](./tests/fake/seeds/person.js). 

Démarrez-le.
```shell
npm run fake:database:migrate
npm run fake:database:seed
npm run fake:start
```

Vérifiez qu'il répond par une 200.
```shell
curl -i \
  --header "Content-Type: application/json" \
  --request PUT \
  --data '{"name":"Dorothy"}' \
  "http://localhost:3001/rnipp/person"
```

Le fake fait l'objet de tests automatisés en local et sur la CI, mais n'est pas disponible sur le PaaS.
Pour cela, il faudrait soit ajouter un nginx devant, soit créer une application séparée, Scalingo n'acceptant qu'un conteneur web par [Procfile](Procfile).