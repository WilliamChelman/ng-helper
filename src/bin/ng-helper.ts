#!/usr/bin/env node
import { CLI } from '../lib/cli/cli';

process.title = 'ng-helper';

console.log(process.argv);

CLI.get().parse(process.argv);
