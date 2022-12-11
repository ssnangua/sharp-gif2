# sharp-gif2

Generate animated GIF/WebP for [sharp](https://www.npmjs.com/package/sharp) base on [gifenc](https://www.npmjs.com/package/gifenc).

![](1.gif) + ![](2.gif) + ![](3.gif) = ![](output/concat.gif)

## Install

```bash
npm install sharp-gif2
```

## Usage

### Generate animated GIF

```js
const fs = require("fs");
const sharp = require("sharp");
const GIF = require("sharp-gif2");

(async () => {
  // Simple use case
  const image = await GIF
    .createGif()
    .addFrame([
      sharp("./frames/0000.png"),
      sharp("./frames/0001.png"),
      sharp("./frames/0002.png"),
    ])
    .toSharp();
  image.toFile("./frames.gif");
  // Can also generate an animated WebP
  image.toFile("./frames.webp");

  // Options
  const gif = GIF.createGif({
    // Sharp constructor options
    sharpOptions: {},
    // Custom size
    width: 300,
    height: 200,
    // Delay(s) between animation frames
    delay: 200,
    // Number of animation iterations
    repeat: 0,
    // Enable 1-bit transparency for the GIF
    transparent: false,
    // Palette max colors
    maxColors: 256,
    // Color format
    format: "rgb565",
    // Resize all frame to `largest` or `smallest`
    resizeTo: "largest",
    // Resize by `zoom` or `crop`
    resizeType: "zoom",
    // Options for sharp.resize()
    resizeOptions: {},
    // Background option for sharp.extend()
    extendBackground: { r: 0, g: 0, b: 0, alpha: 0 },
    // gifenc GIFEncoder() options
    gifEncoderOptions: {},
    // gifenc quantize() options
    gifEncoderQuantizeOptions: {},
    // gifenc gif.writeFrame() options
    gifEncoderFrameOptions: {},
  });
  gif.addFrame(sharp("./1.png"));
  gif.addFrame(sharp("./2.png"));
  const image = await gif.toSharp();
  image.toFile("./frames.gif");

  // Trace encoding progress
  const image = await GIF
    .createGif()
    .addFrame(
      fs.readdirSync("./frames")
        .map((file) => sharp(`./frames/${file}`))
    )
    .toSharp(({ total, encoded }) => {
      console.log(`${encoded}/${total}`);
    });
  image.toFile("./frames.gif");

  // You can even concat animated GIFs
  const image = await GIF
    .createGif({
      transparent: true,
      format: "rgb444",
      maxColors: 32,
    })
    .addFrame([
      sharp("./1.gif", { animated: true }),
      sharp("./2.gif", { animated: true }),
    ])
    .toSharp();
  image.toFile("./concat.gif");
})();
```

### Processing GIF frames

```js
const sharp = require("sharp");
const GIF = require("sharp-gif2");

(async () => {
  const reader = GIF.readGif(sharp("./2.gif", { animated: true }));
  const frames = await reader.toFrames();
  frames.forEach((frame, index) => {
    // You can process each frame here

    // Or just simple output frame
    frame.toFile(`./output/${("000" + index).substr(-4)}.png`);
  });

  const gif = await reader.toGif({ transparent: true, });
  const image = await gif.toSharp();
  image.toFile("./output/remake.gif");
})();
```

## API

### `GIF.createGif(options?: Object): Gif`

- `options` Object _(optional)_
  - `sharpOptions` Object _(optional)_ - Sharp constructor [options](https://sharp.pixelplumbing.com/api-constructor#parameters).
  - `width` Number _(optional)_ - Width, in pixels, of the GIF to output.
  - `height` Number _(optional)_ - Height, in pixels, of the GIF to output.
  - `delay` (Number | Number[]) _(optional)_ - Delay(s) between animation frames (in milliseconds).
  - `repeat` Number _(optional)_ - Number of animation iterations, use `0` for infinite animation. Default by `0`.
  - `transparent` Boolean _(optional)_ - Enable 1-bit transparency for the GIF. Default by `false`.
  - `maxColors` Number _(optional)_ - Quantize the total number of colors down to a reduced palette no greater than maxColors. Default by `256`.
  - `format` ("rgb565" | "rgb444" | "rgba4444") _(optional)_ - Color format. Default by `rgb565`.
    - `rgb565` means 5 bits red, 6 bits green, 5 bits blue (better quality, slower)
    - `rgb444` is 4 bits per channel (lower quality, faster)
    - `rgba4444` is the same as above but with alpha support
  - `resizeTo` ("largest" | "smallest") _(optional)_ - Resize all frame to the `largest` frame or `smallest` frame size. Default by `largest`.
  - `resizeType` ("zoom" | "crop") _(optional)_ - `zoom` use sharp.resize(), `crop` use sharp.extend() and sharp.extract(). Default by `zoom`.
  - `resizeOptions` [sharp.ResizeOptions](https://sharp.pixelplumbing.com/api-resize#parameters) _(optional)_ - Options for sharp.resize().
  - `extendBackground` [sharp.Color](https://www.npmjs.org/package/color) _(optional)_ - Background option for sharp.extend().
  - `gifEncoderOptions` Object _(optional)_ - gifenc [GIFEncoder()](https://github.com/mattdesl/gifenc#gif--gifencoderopts--) options.
  - `gifEncoderQuantizeOptions` Object _(optional)_ - gifenc [quantize()](https://github.com/mattdesl/gifenc#palette--quantizergba-maxcolors-options--) options.
  - `gifEncoderFrameOptions` Object _(optional)_ - gifenc [gif.writeFrame()](https://github.com/mattdesl/gifenc#gifwriteframeindex-width-height-opts--) options.

Returns `Gif` - Return a instance of Gif Contains the following methods:

#### `gif.addFrame(frame: Sharp | Sharp[]): Gif`

- `frame` (Sharp | Sharp[]) - An instance of Sharp, or an array of instance of Sharp.

Returns `Gif` - Return the Gif instance for chaining.

#### `gif.toSharp(progress?: Function, encoder?: GIFEncoder): Promise<Sharp>`

Encode all frames and resolve with an animated Sharp instance.

- `progress` (info: Object) => void _(optional)_ - Frames encoding progress.
  - `info` Object
    - `total` Number - Total frames count.
    - `encoded` Number - Encoded frames count.
- `encoder` GIFEncoder _(optional)_ - Custom [GIFEncoder](https://github.com/mattdesl/gifenc#gif--gifencoderopts--).

Returns `Promise<Sharp>` - Resolve with an instance of Sharp.

#### `gif.toBuffer(progress?: Function, encoder?: GIFEncoder): Promise<Buffer>`

Encode all frames and resolve with an animated GIF buffer.

#### `gif.getEncoder(options?: Object): GIFEncoder`

- `options` Object _(optional)_ - gifenc [GIFEncoder()](https://github.com/mattdesl/gifenc#gif--gifencoderopts--) options.

Return a GIFEncoder.

### `GIF.readGif(image: Sharp): GifReader`

- `image` Sharp - An instance of Sharp

Returns `GifReader` - Return a instance of GifReader Contains the following methods:

#### `reader.toFrames(progress?: Function): Promise<Sharp[]>`

Cut GIF frames.

- `progress` (info: Object) => void _(optional)_ - Frames cutting progress.
  - `info` Object
    - `cutted` Number - cutted frames count.
    - `total` Number - Total frames count.

Returns `Promise<Sharp[]>` - Resolve with cutted frames (an array of instance of Sharp).

#### `reader.toGif(options?: Object): Promise<Gif>`

Create Gif from cutted frames.

- `options` Object _(optional)_ - Options for createGif(). See [createGif](#gifcreategifoptions-object-gif).

Returns `Promise<Gif>` - Resolve with an instance of Gif.

A shortcut to create a Gif with the cutted frames, equal to:

`GIF.createGif(options).addFrame(reader.frames || (await reader.toFrames()));`

## Change Log

### 0.1.3

- Feature: `reader.toFrames(progress)` adds progress option.
