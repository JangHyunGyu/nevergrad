'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('sharp');
const root = path.join(__dirname, '..');
const config = vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/config.js'), 'utf8') + '\nCONFIG;', {});

async function main() {
    const groups = {
        backgrounds: Object.values(config.BACKGROUNDS),
        expressions: Object.values(config.EXPRESSIONS).flatMap(Object.values),
        evidence: Object.values(config.EVIDENCE_IMAGES),
        subjects: Object.values(config.SUBJECT_FACE_IMAGES)
    };
    const report = { scope: 'All non-null CONFIG image registry paths; aliases share files.', groups: {}, failures: [] };
    for (const [name, values] of Object.entries(groups)) {
        const refs = values.filter(Boolean), files = [...new Set(refs)];
        report.groups[name] = { references: refs.length, uniqueFiles: files.length };
    }
    const files = [...new Set(Object.values(groups).flat().filter(Boolean))];
    for (const file of files) {
        try {
            // Decode pixels as well as the header, including transparent sprites.
            await sharp(path.join(root, file)).resize(1, 1).raw().toBuffer();
        } catch (error) { report.failures.push({ file, error: error.message }); }
    }
    report.uniqueFiles = files.length;
    report.decodedFiles = files.length - report.failures.length;
    const output = process.argv[2];
    if (output) fs.writeFileSync(path.resolve(root, output), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    if (report.failures.length) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
