#!/usr/bin/env node

const sharp = require('sharp');
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

let inputDir = process.cwd();
let outputDir = process.cwd();
let imageFiles;
let sizes = [100, 200, 400, 800];
let formats = ['avif', 'webp'];

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
    'outputDir': {
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

// set sizes and formats based on command line arguments
sizes = args.sizes;
formats = args.formats;

// Check for configuration file and set input/output directories
const configFile = path.resolve(process.cwd(), 'bimgc.config.js');
if (fs.existsSync(configFile)) {
  const config = require(configFile);
  if (config.inputDir) {
    inputDir = config.inputDir;
  }
  if (config.outputDir) {
    outputDir = config.outputDir;
  }
  if (config.imageFiles) {
    imageFiles = config.imageFiles;
    if (!imageFiles || imageFiles.length === 0) {
      console.error('🚫 No image files specified. Set it in the config file.');
      process.exit(1);
    }
  }
  if (config.sizes) {
    sizes = config.sizes;
  }
  if (config.formats) {
    formats = config.formats;
  }
}

// if outputDir is given in the args, overwrite outputDir
if (args['outputDir']) {
  outputDir = args['outputDir'];
}

// create outputDir if it doesn't exsit
try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log('Directory created:', outputDir);
  }
} catch (err) {
  console.error('Error while creating directory:', err);
}

// check if imageFiles are set 
if (!imageFiles || imageFiles.length === 0) {
  if (args._[0]) {
    imageFiles = args._
  } else {
    console.error('🚫 No image files specified.');
    process.exit(1);
  }
}

if (!sizes || sizes.length === 0) {
  sizes = args.sizes;
}

if (!formats || formats.length === 0) {
  formats = args.formats;
}

const help = args.help;

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

console.log(`Converting ${imageFiles.length} file(s) to ${formats.join(', ')} at sizes ${sizes.join(', ')}...`);

(async function () {
  for (const inputFile of imageFiles) {
    if (!fs.existsSync(path.join(inputDir, inputFile))) {
      console.error(`🚫 File not found: ${inputFile}`);
      continue;
    }

    try {
      const image = sharp(path.join(inputDir, inputFile));
      const imageMetadata = await image.metadata();

      for (const size of sizes) {
        const outputFile = path.join(outputDir, `${path.basename(inputFile, path.extname(inputFile))}-${size}${path.extname(inputFile)}`);
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
          const outputFile = path.join(outputDir, `${path.basename(inputFile, path.extname(inputFile))}-${size}.${format}`);
      
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
      
      console.log(`✅ Conversion complete for ${inputFile}`);
    } catch (error) {
      console.error(`🚫 Error while converting ${inputFile}:`, error);
    }
  }
  console.log('🚀🚀🔥🔥 Done!');
})();
