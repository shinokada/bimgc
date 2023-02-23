#!/usr/bin/env node

const sharp = require('sharp');
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const {version} = require('../package.json');

let inputDir = 'public/images';
let outputDir = 'public/images';

// Check for configuration file and set input/output directories
const configFile = path.resolve(process.cwd(), '.bimgc.config.js');
if (fs.existsSync(configFile)) {
  const config = JSON.parse(fs.readFileSync(configFile));
  if (config.inputDir) inputDir = config.inputDir;
  outputDir = config.outputDir || outputDir;
}

const args = yargs
  .options({
    sizes: {
      type: 'array',
      demandOption: false,
      default: [100, 200, 400, 800],
      description: 'Array of sizes to generate',
      alias: 's',
    },
    format: {
      type: 'array',
      demandOption: false,
      default: ['avif', 'webp'],
      description: 'Formats to generate',
      alias: 'f',
    },
    'output-dir': {
      type: 'string',
      demandOption: false,
      description: 'Output directory',
      alias: 'o',
    },
    help: {
      type: 'boolean',
      demandOption: false,
      default: false,
      description: 'Show help',
    },
  })
  .help()
  .version(version)
  .argv;

// Use the same naming convention when setting the output directory
if (args['output-dir']) {
  outputDir = args['output-dir'];
}

const inputFile = args._[0];
const inputFileBase = path.basename(inputFile);
const sizes = args.sizes;
const formats = args.format;
const help = args.help;

if (!inputFile && !inputFile.length) {
  console.error('🚫 Please provide an input file');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`🚫 File not found: ${inputFile}`);
  process.exit(1);
}

if (help) {
  yargs.showHelp();
  process.exit(0);
}

const supportedFormats = ['webp', 'avif'];

for (const format of formats) {
  if (!supportedFormats.includes(format)) {
    console.error(`🚫 Unsupported format: ${format}. Supported formats are: ${supportedFormats.join(', ')}`);
    process.exit(1);
  }
}

console.log(`Converting ${inputFile} to ${formats.join(', ')} at sizes ${sizes.join(', ')}...`);

(async function() {
  try {
    const image = sharp(inputFile);
    const imageMetadata = await image.metadata();

    for (const size of sizes) {
      const outputFile = path.join(outputDir, `${inputFileBase.replace(/\.[^/.]+$/, '')}-${size}.${inputFile.split('.').pop()}`);
      // const outputFile = `${outputDir}/${inputFile.replace(/\.[^/.]+$/, '')}-${size}.${inputFile.split('.').pop()}`;
      console.log(`Generating ${outputFile}...`);
    
      await image
        .resize({
          width: size,
          height: Math.round((size / imageMetadata.width) * imageMetadata.height),
        })
        .toFile(outputFile);
    }

    for (const format of formats) {
      for (const size of sizes) {
        const outputFile = path.join(outputDir, `${inputFileBase.replace(/\.[^/.]+$/, '')}-${size}.${format}`);

        console.log(`Generating ${outputFile}...`);

        await image
          .resize({
            width: size,
            height: Math.round((size / imageMetadata.width) * imageMetadata.height),
          })
          .toFormat(format)
          .toFile(outputFile);
      }
    }

    console.log('🚀🚀🔥🔥 Done!');
  } catch (error) {
    console.error(`🚫 Error:`, error);
    process.exit(1);
  }
})();
