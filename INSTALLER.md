# Installer

Les instructions suivantes vous permettront :
- d'exécuter l'application en local, pour faire des tests manuels ;
- de développer sur l'application.

## Prérequis

Logiciels:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/), version indiquée dans le fichier [.nvmrc](.nvmrc))
- [Docker](https://docs.docker.com/get-started/)

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

Initialiser la configuration
```shell
cp .envrc.sample .envrc
```

Exécuter les tests.
```shell
npm run test
```

## Développer

Avant de développer, lire les règles [dans ce guide](CONTRIBUER.md)