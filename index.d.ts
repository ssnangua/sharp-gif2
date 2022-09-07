import { Color, RawOptions, ResizeOptions, Sharp, SharpOptions } from "sharp";

/**
 * gifenc GIFEncoder options
 */
export declare interface GifEncoderOptions {
  auto?: Boolean;
  initialCapacity?: Number;
}

/**
 * gifenc quantize() options
 */
export declare interface GifEncoderQuantizeOptions {
  format?: "rgb565" | "rgb444" | "rgba4444";
  oneBitAlpha?: Boolean | Number;
  clearAlpha?: Boolean;
  clearAlphaThreshold?: Number;
  clearAlphaColor?: Number;
}

/**
 * gifenc gif.writeFrame() options
 */
export declare interface GifEncoderFrameOptions {
  palette?: Number[][];
  first?: Boolean;
  transparent?: Boolean;
  transparentIndex?: Number;
  delay?: Number;
  repeat?: Number;
  dispose?: Number;
}

/**
 * gifenc GIFEncoder
 */
export declare interface GIFEncoder {
  readonly buffer: ArrayBufferLike;
  readonly stream: {
    readonly buffer: ArrayBufferLike;
    reset(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
    writeByte(byte: Number): void;
    writeBytes(data: Number[], offset: Number, byteLength: Number): void;
    writeBytesView(data: Uint8Array, offset: Number, byteLength: Number): void;
  };
  finish(): void;
  bytes(): Uint8Array;
  bytesView(): Uint8Array;
  writeHeader(): void;
  writeFrame(
    index: Uint8Array,
    width: Number,
    height: Number,
    opts: GifEncoderFrameOptions
  ): void;
  reset(): void;
}

/**
 * Gif options
 * @param gifEncoderOptions - gifenc GIFEncoder() options.
 * @param gifEncoderQuantizeOptions - gifenc quantize() options.
 * @param gifEncoderFrameOptions - gifenc gif.writeFrame() options.
 * @param sharpOptions - sharp constructor options.
 * @param width - Width, in pixels, of the GIF to output.
 * @param height - Height, in pixels, of the GIF to output.
 * @param delay - Delay(s) between animation frames (in milliseconds).
 * @param repeat - Number of animation iterations, use `0` for infinite animation. Default by `0`.
 * @param transparent - Enable 1-bit transparency for the GIF.
 * @param maxColors - Quantize the total number of colors down to a reduced palette no greater than maxColors. Default by `256`.
 * @param format - Color format. Default by `"rgb565"`.
 * @param resizeTo - Resize all frame to the `largest` frame or `smallest` frame size.
 * @param resizeType - Resize type, `zoom` or `crop`.
 * @param resizeOptions - sharp resize options.
 * @param extendBackground - sharp extend background option.
 * @param rawOptions - sharp raw options.
 * @public
 */
export declare interface GifOptions {
  gifEncoderOptions?: GifEncoderOptions;
  gifEncoderQuantizeOptions?: GifEncoderQuantizeOptions;
  gifEncoderFrameOptions?: GifEncoderFrameOptions;
  sharpOptions?: SharpOptions;
  width?: Number;
  height?: Number;
  delay?: Number | Number[];
  repeat?: Number;
  transparent?: Boolean;
  maxColors?: Number;
  format?: "rgb565" | "rgb444" | "rgba4444";
  resizeTo?: "largest" | "smallest";
  resizeType?: "zoom" | "crop";
  resizeOptions?: ResizeOptions;
  extendBackground?: Color;
  rawOptions?: RawOptions;
}

export declare interface ProgressHandler {
  (progress: { total: Number; encoded: Number }): void;
}

/**
 * Gif
 */
export declare class Gif {
  constructor(options?: GifOptions);
  /**
   * Add new frames
   * @param frame
   */
  addFrame(frame: Sharp | Sharp[]): Gif;
  /**
   * Create a GIFEncoder
   * @param width
   * @param height
   * @param gifEncoderOptions
   */
  getEncoder(gifEncoderOptions?: GifEncoderOptions): GIFEncoder;
  /**
   * Encode all frames and resolve with an animated GIF buffer
   * @param encoder
   */
  toBuffer(progress?: ProgressHandler, encoder?: GIFEncoder): Promise<Buffer>;
  /**
   * Encode all frames and resolve with an animated sharp instance
   * @param encoder
   */
  toSharp(progress?: ProgressHandler, encoder?: GIFEncoder): Promise<Sharp>;
}

export declare class GifReader {
  constructor(image: Sharp);
  /**
   * Cut GIF frames
   */
  toFrames(): Promise<Sharp[]>;
  /**
   * Create Gif from cutted frames
   * @param options
   */
  toGif(options?: GifOptions): Promise<Gif>;
}

/**
 * Create Gif
 */
export declare function createGif(options?: GifOptions): Gif;

/**
 * Read Gif
 */
export declare function readGif(image: Sharp): GifReader;
