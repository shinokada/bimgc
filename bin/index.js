const sharp = require('sharp');
const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const {version} = require('../package.json');

const args = yargs
  .options({
    size: {
      type: 'array',
      demandOption: false,
      default: [100, 200, 400, 800],
      description: 'Array of sizes to generate',
    },
    format: {
      type: 'array',
      demandOption: false,
      default: ['avif', 'webp'],
      description: 'Formats to generate',
    },
    outputdir: {
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


const inputFile = args._[0];
const inputFileBase = path.basename(inputFile);
const sizes = args.size;
const formats = args.format;
const help = args.help;
const outputDir = args.outputdir || '.';

if (!inputFile) {
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
    console.error(`🚫 error`);
    process.exit(1);
  }
})();
