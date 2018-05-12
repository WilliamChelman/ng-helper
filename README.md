# ng-helper [![Build Status](https://travis-ci.org/WilliamChelman/ng-helper.svg?branch=master)](https://travis-ci.org/WilliamChelman/ng-helper)

[![Greenkeeper badge](https://badges.greenkeeper.io/WilliamChelman/ng-helper.svg)](https://greenkeeper.io/)

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

You can serve multiple applications and libraries with just one line of code using `ng-helper serve`.

```bash
Usage: ng-helper serve [options] [projects...]

  Options:

    -i, --interactive     launch in interactive mode
    -a, --all             start everything
    --all-libs            start all libraries
    --projectRoot [path]  path to the root of the repository (default: /home/wchelman/Dev/ng-helper)
    -h, --help            output usage information
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

So you could serve them like (partially) with `ng-helper serve lib-b app-b lib-a` or `npm run ng-helper -- serve lib-b app-b lib-a`. The libraries will be served first and then the applications. Also, the serving follows the order in the `angular.json` file. So in this example, the projects are served in the following order: `lib-a`, `lib-b` and then `app-b`. A few things to take in consideration:

*   When serving multiple apps at the same time, beware that the default port 4200 might be used for all of them, so you might want to modify the corresponding `angular.json` properties to specify different ports for the different apps.
*   The e2e applications cannot be served and the binary ignore all applications ending with `-e2e`
*   Since the order in the `angular.json` set the build order of the libraries, be sure that, if you have a library `lib-b` that depends on a library `lib-a`, `lib-a` should be placed before `lib-b` in the `angular.json`.

## Licence

MIT
