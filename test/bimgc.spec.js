const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const { promisify } = require('util');
const { version } = require('../package.json');
const bimgcConfig = require('./test.bimgc.config');

// const rimrafAsync = promisify(rimraf);

describe('bimgc', () => {
  const bimgcPath = path.join(__dirname, '..', 'bin', 'index.js');
  const testDir = path.join(__dirname, 'test-dir');
  const inputDir = bimgcConfig.inputDir || process.cwd();
  const outputDir = bimgcConfig.outputDir || process.cwd();
  const imageFiles = bimgcConfig.imageFiles || [];
  const sizes = bimgcConfig.sizes || [100, 200, 400, 800];
  const formats = bimgcConfig.formats || ['webp', 'avif'];

  beforeAll(async () => {
    // Create test directory and output directory if they don't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  
    // Copy test images to the input directory
    fs.copyFileSync(path.join(__dirname, 'test-image-1.jpg'), path.join(inputDir, 'test-image-1.jpg'));
    fs.copyFileSync(path.join(__dirname, 'test-image-2.jpg'), path.join(inputDir, 'test-image-2.jpg'));
  });
  

  afterAll(async () => {
    // Remove test directory and images
    await fs.remove(testDir);
  });

  it('should generate webp and avif files at specified sizes', async () => {
    const webp100Path = path.join(outputDir, 'test-image-1-100.webp');
    const webp200Path = path.join(outputDir, 'test-image-1-200.webp');
    const avif100Path = path.join(outputDir, 'test-image-1-100.avif');
    const avif200Path = path.join(outputDir, 'test-image-1-200.avif');

    // Generate output images using the bimgc script
    const output = execSync(`node ${bimgcPath} --outputDir=${outputDir} --sizes=${sizes.join(',')} --format=${formats.join(',')} ${imageFiles.join(' ')}`).toString();

    // Check that the output images were generated
    expect(fs.existsSync(webp100Path)).toBe(true);
    expect(fs.existsSync(webp200Path)).toBe(true);
    expect(fs.existsSync(avif100Path)).toBe(true);
    expect(fs.existsSync(avif200Path)).toBe(true);
  });

  it('should show help', async () => {
    // Get the help output from the bimgc script
    const output = execSync(`node ${bimgcPath} --help`).toString();

    // Check that the help output includes the expected strings
    expect(output).toContain('Options:');
    // expect(output).toContain('Examples:');
  });
});
