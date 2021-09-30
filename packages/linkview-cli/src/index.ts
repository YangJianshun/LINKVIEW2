#! /usr/bin/env node

import main from './main';
import { withErrorConsole } from '@linkview/linkview-core';

withErrorConsole(main)();

