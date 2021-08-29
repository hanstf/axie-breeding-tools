#!/usr/bin/env node

const { program } = require('commander');
const findAxiesByParts = require('./tools/find-axies-by-parts');

findAxiesByParts(program);

program.parse();