'use strict';
const fs = require('node:fs');
const { gunzipSync } = require('node:zlib');
// The Korean entry point ships a gzip-wrapped document. Validate the document
// the player receives, including its scripts, icons and save-slot elements.
module.exports = function readHtml(file) {
    const source = fs.readFileSync(file, 'utf8');
    const packed = source.match(/var b64 = "([A-Za-z0-9+/=]+)"/);
    return packed ? gunzipSync(Buffer.from(packed[1], 'base64')).toString('utf8') : source;
};
