const { createGzip } = require('zlib');
const stream = require('stream');
const util = require("util");

const promisifiedPipeline = util.promisify(stream.pipeline);

const gzip = async (source, destination) => await promisifiedPipeline(source, createGzip(), destination);

module.exports = gzip;
