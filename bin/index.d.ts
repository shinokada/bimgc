declare function bimgc(imageFiles: string[], options?: {
  sizes?: number[],
  format?: string[],
  outputDir?: string,
  config?: string,
  help?: boolean
}): Promise<void>;

export default bimgc;
