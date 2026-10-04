#!/usr/bin/env node
'use strict';
// Runs `node --check` over every JS source file so a syntax error (e.g. an
// unescaped apostrophe in a string) can never ship unnoticed.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git']);
const EXT = /\.(?:js|cjs|mjs)$/;

function walk(dir, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
        } else if (entry.isFile() && EXT.test(entry.name)) {
            out.push(path.join(dir, entry.name));
        }
    }
    return out;
}

const files = walk(ROOT, []).sort();
const failures = [];
for (const file of files) {
    const res = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (res.status !== 0) {
        failures.push({ file: path.relative(ROOT, file), output: (res.stderr || res.stdout || '').trim() });
    }
}

if (failures.length) {
    for (const f of failures) console.error(`[SYNTAX] ${f.file}\n${f.output}\n`);
    console.error(`node --check failed for ${failures.length}/${files.length} file(s)`);
    process.exit(1);
}
console.log(`node --check OK (${files.length} files)`);
