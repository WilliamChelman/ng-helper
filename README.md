# ng-helper

[![npm version](https://badge.fury.io/js/%40nephidream%2Fng-helper.svg)](https://badge.fury.io/js/%40nephidream%2Fng-helper) [![Build Status](https://travis-ci.org/WilliamChelman/ng-helper.svg?branch=master)](https://travis-ci.org/WilliamChelman/ng-helper) [![codecov](https://codecov.io/gh/WilliamChelman/ng-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/WilliamChelman/ng-helper) [![Greenkeeper badge](https://badges.greenkeeper.io/WilliamChelman/ng-helper.svg)](https://greenkeeper.io/) [![CodeFactor](https://www.codefactor.io/repository/github/williamchelman/ng-helper/badge)](https://www.codefactor.io/repository/github/williamchelman/ng-helper)

Help you ease development experience with an `@angular/cli` 6+ project with multiple applications and/or libraries.

## Install

```bash
npm i @nephidream/ng-helper -D
```

or

```bash
npm i @nephidream/ng-helper -g
```

note: when used globally, you need to have `nodemon` and `@angular/cli` installed globally too, so local install is advised.

## Usage

Make the bin directly available in your `package.json` script like `ng`.

```json
{
    "scripts": {
        "ng-helper": "ng-helper"
    }
}
```

Like this you can do stuff like `npm run ng-helper -- serve -i`

### Serve

You can serve multiple applications and libraries with just one line of code using `ng-helper serve`. With this, served libraries are automatically rebuilt on code modification, and the apps using them as well.

```bash
  Usage: ng-helper ng-serve [options] [projects...]

  Options:

    -i, --interactive        launch in interactive mode
    -a, --all                select all projects
    --all-libs               select all libraries
    --app-options <options>  set options for app tasks, like "--aot --prod" (if more than one option, you have to put everything between quotes)
    --project-root <path>    path to the root of the repository (default: current folder)
    -h, --help               output usage information
```

For example, if you are in the root of your application and you generated some applications and/or libraries, your `angular.json` might look like

```json
{
    "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    "version": 1,
    "newProjectRoot": "projects",
    "projects": {
        "test-app": { ... },
        "test-app-e2e": { ... },
        "app-a": { ... },
        "app-a-e2e": { ... },
        "app-b": { ... },
        "app-b-e2e": { ... },
        "lib-a": { ... },
        "lib-b": { ... }
    },
    "defaultProject": "test-app"
}
```

So you could serve them (partially) with `npm run ng-helper -- serve lib-b app-b lib-a`. The libraries will be served first and then the applications. Also, the serving follows the order in the `angular.json` file. So in this example, the projects are served in the following order: `lib-a`, `lib-b` and then `app-b`.

A few other things to consider:

*   When serving multiple apps at the same time, beware that the default port 4200 might be used for all of them, so you might want to modify the corresponding `angular.json` properties to specify different ports for the different apps.
*   The e2e applications cannot be served and the binary ignore all applications ending with `-e2e`
*   Since the order in the `angular.json` set the build order of the libraries, be sure that, if you have a library `lib-b` that depends on a library `lib-a`, `lib-a` should be placed before `lib-b` in the `angular.json`.

### Build

You can build multiple applications and libraries with just one line of code using `ng-helper build`.

```bash
  Usage: ng-helper ng-serve [options] [projects...]

  Options:

    -i, --interactive        launch in interactive mode
    -a, --all                select all projects
    --all-libs               select all libraries
    --app-options <options>  set options for app tasks, like "--aot --prod" (if more than one option, you have to put everything between quotes)
    --project-root <path>    path to the root of the repository (default: current folder)
    -h, --help               output usage information
```

The build order follow the same logic as the one presented in the `Serve` section.

## Licence

MIT
