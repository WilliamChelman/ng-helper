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

## Usage

Make the bin directly available in your `package.json` script like `ng`.

```json
{
    "scripts": {
        "ng-helper": "ng-helper"
    }
}
```

Like this you can do stuff like `npm run ng-helper -- serve -i`. A typical use could be

```json
{
    "scripts": {
        "start": "ng-helper serve -A",
        "test": "ng-helper test -A",
        "test:ci" : "npm test -- --app-options '--no-watch' --lib-options '--no-watch'",
        "build": "ng-helper build -A",
        ...
    }
}
```

Please note that `-A` will select all projects (apps and libraries), so if you have multiple applications, you might want to adapt your start scripts like

```json
{
    "scripts": {
        "start": "ng-helper serve -a main-app",
        "start:app-a": "ng-helper serve -a app-a",
        "start:app-b": "ng-helper serve -a app-b",
        ...
    }
}
```

### Serve

You can serve multiple applications and libraries with just one line of code using `ng-helper serve`. With this, served libraries are automatically rebuilt on code modification, and the apps using them as well. A typical use case could be `ng-helper serve --all-libs my-app`.

```bash
  Usage: ng-helper serve [options] [projects...]

  Options:

    -A, --all                  select all projects
    -a, --all-libs             select all libraries
    --app-options <options>    set options for app tasks, like "--aot --prod" (if more than one option, you have to put everything between quotes)
    -i, --interactive          launch in interactive mode
    --log-level <level>        set the log level, possible values are DEBUG,LOG,INFO,WARN,ERROR,NONE (default: INFO)
    -p, --project-root <path>  path to the root of the repository (default: current folder)
    -h, --help                 output usage information
```

For example, if you are in the root of your project and you generated some applications and/or libraries, your `angular.json` might look like

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
  Usage: ng-helper build [options] [projects...]

  Options:

    -A, --all                  select all projects
    -a, --all-libs             select all libraries
    --app-options <options>    set options for app tasks, like "--aot --prod" (if more than one option, you have to put everything between quotes)
    -i, --interactive          launch in interactive mode
    --log-level <level>        set the log level, possible values are DEBUG,LOG,INFO,WARN,ERROR,NONE (default: INFO)
    -p, --project-root <path>  path to the root of the repository (default: current folder)
    -h, --help                 output usage information
```

The build order follow the same logic as the one presented in the `Serve` section.

### Test

You can test multiple applications and libraries with just one line of code using `ng-helper test`.

```bash
  Usage: test [options] [projects...]

  Options:

    -A, --all                  select all projects
    -a, --all-libs             select all libraries
    --app-options <options>    set options for app tasks, like "--aot --prod" (if more than one option, you have to put everything between quotes)
    --lib-options <options>    set options for lib tasks, like "--prod" (if more than one option, you have to put everything between quotes)
    -i, --interactive          launch in interactive mode
    --log-level <level>        set the log level, possible values are DEBUG,LOG,INFO,WARN,ERROR,NONE (default: INFO)
    -p, --project-root <path>  path to the root of the repository (default: current folder)
    -h, --help                 output usage information
```

If one of the projects' tests fail, the process exit with the corresponding exit code;

### Version

You can change the version of all `package.json` of the different projects.

```bash
  Usage: version [options] [value]

  Options:

    -p, --project-root <path>  path to the root of the repository (default: /home/wchelman/Dev/ng-helper)
    -h, --help                 output usage information
```

If no value (like `1.0.1`) is given, the version of the root `package.json` will be applied to all others.

## Licence

MIT
