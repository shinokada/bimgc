<h1 align="center">BIMGC</h1>

<p align="center">
<a href="https://bimgc.codewithshin.com/" rel="nofollow">Batch Image Converter</a>
</p>

<p align="center">
<a href="https://github.com/sponsors/shinokada" target="_blank"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor" height="22" width="102"></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"><img src="https://img.shields.io/badge/PWA-enabled-brightgreen" alt="PWA Shield"></a>
<a href="https://www.npmjs.com/package/bimgc" rel="nofollow" target="_blank"><img src="https://img.shields.io/npm/v/bimgc" alt="npm" height="22" width="97"></a>
<a href="https://twitter.com/shinokada" rel="nofollow" target="_blank"><img src="https://img.shields.io/badge/created%20by-@shinokada-4BBAAB.svg" alt="Created by Shin Okada" height="22" width="161"></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow" target="_blank"><img src="https://img.shields.io/github/license/shinokada/bimgc" alt="License" height="22" width="86"></a>
<a href="https://www.npmjs.com/package/bimgc" rel="nofollow" target="_blank"><img src="https://img.shields.io/npm/dw/bimgc.svg" alt="npm" height="22" width="152"></a>
</p>

<p align="center">
<picture>
  <img
    src="public/images/bimgc-optimized.png"
    sizes="(max-width: 1200px) 100vw, 50vw"
    style="width: 100%; aspect-ratio: 1.6172506738544474"
    decoding="async"
    alt="Batch image converter"
  />
</picture>
</p>

A CLI tool for converting PNG and JPG images to AVIF and WebP format with various sizes and saves them in a specified output directory. The output images are named based on the input file and include information about their size and format.

It is recommended to use this script in conjunction with [imgtaggen](https://imgtaggen.codewithshin.com/).

## Installation

```bash
npm i -g bimgc
bimgc --version
bimgc --help
cd path/to/your/project
```

## Usage

`bimgc` can be used as a command-line utility or it can be configured with a `bimgc.config.js` file.


## Configuration file

You can create a `bimgc.config.js` file in the root of your project to configure bimgc. The configuration file should export an object with the following properties:

- `inputDir`: Input directory for image files. Default: current working directory
- `outputDir`: Output directory for generated images. Default: current working directory
- `sizes`: Array of sizes to generate. Default: [100, 200, 400, 800]
- `formats`: Array of formats to generate. Default: ['avif', 'webp']
- `imageFiles`: Array of image files to generate. This property is required when using a configuration file.

Example bimgc.config.js file:

```
module.exports = {
  inputDir: "public/images",
  outputDir: "public/images/output",
  sizes: [100, 200, 400, 800],
  formats: ['avif', 'webp'],
  imageFiles: [
    'example-1.jpg',
    'example-2.png'
  ]
};
```

Then run the following command to generate responsive images:

```sh
bimgc
```

The script will use the parameters specified in the configuration file and generate the resized images in the output directory.

Note that if you specify a parameter in both the configuration file and the command line arguments, the value from the command line arguments will take precedence.

## Package Usage

`bimgc` can be used in your JavaScript project by creating a configuration file in CommonJS module format (with a `.cjs` file extension).

To use the package, add the following to the `scripts` section of your `package.json` file:

```json
"scripts": {
		"gen:images": "bimgc -c bimgc.config.cjs"
	},
```

To generate the images, run the following command:

```sh
npm run gen:images
```

This will generate images in the specified sizes and formats and save them to the outputDir.

## Command-line Usage

You can use the bimgc package from the command line to specify the input directory, output directory, image files, sizes to generate, and formats to generate.

To run the script with command line arguments, use the following syntax:

```sh
$ bimgc <input_files> [options]
```

Options
- `-s, --sizes <array>`: Array of sizes to generate. Default: [100, 200, 400, 800]
- `-f, --format <array>`:  An array of formats to generate. Default: ['avif', 'webp']
- `-o, --outputDir <string>`: Output directory. Default: current working directory
- --help: Show help
- --version: Show version number

For example, to resize an image named input.jpg to sizes 100, 200, and 300 pixels in AVIF format and save the resized images in the directory /path/to/output, enter the following command:

```sh
$ bimgc input.jpg -s 100 200 300 -f avif -o /path/to/output
```

You can also specify multiple input files and generate resized images for each of them. For example, to resize input1.jpg, input2.jpg, and input3.jpg to sizes 100, 200, and 300 pixels in WEBP format and save the resized images in the directory /path/to/output, enter the following command:

```sh
$ bimgc input1.jpg input2.jpg input3.jpg -s 100 200 300 -f webp -o /path/to/output
```

Note that if you do not specify any options, the script will use the default configuration, which is to resize images to sizes 100, 200, 400, and 800 pixels in WebP and AVIF format, and save the resized images in the current working directory.

## Test

```sh
npm run test
```

## Use this with imgtaggen

[imgtaggen](https://imgtaggen.codewithshin.com/) is a CLI tool for generating a responsive image tag with support for AVIF and WebP formats. It will also calculate image ratio.

Use `bimgc` in conjunction with `imgtaggen`.

## PWA: Fast & Offline

The [docs website]() can be downloaded and installed on your device for offline access as a Progressive Web App.

To install a PWA, look for the "Add to Home Screen" option in the browser's menu or settings. On most mobile devices, this option can be found by visiting the website, then selecting the "Options" or "Menu" button in the browser, and looking for the "Add to Home Screen" option. On some desktop browsers, right-click on the page and select "Install".