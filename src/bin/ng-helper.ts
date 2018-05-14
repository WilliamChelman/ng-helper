#!/usr/bin/env node
import { CLI } from '../cli/cli';

process.title = 'ng-helper';

CLI.init();
CLI.parse(process.argv);
