#!/usr/bin/env node
import { CLI } from '../cli/cli';

process.title = 'ng-helper';

CLI.get().parse(process.argv);
