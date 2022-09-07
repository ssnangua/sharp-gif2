const fs = require("fs");
const sharp = require("sharp");
const GIF = require("./index");

if (!fs.existsSync("./output")) fs.mkdirSync("./output");

async function simpleUseCase() {
  const image = await GIF.createGif()
    .addFrame([
      sharp("./frames/0000.png"),
      sharp("./frames/0001.png"),
      sharp("./frames/0002.png"),
    ])
    .toSharp();
  image.toFile("./output/frames.gif");
}

async function traceEncodingProgress() {
  const now = Date.now();
  const image = await GIF.createGif({ delay: 50 })
    .addFrame(
      fs.readdirSync("./frames").map((file) => sharp(`./frames/${file}`))
    )
    .toSharp(({ total, encoded }) => {
      console.log(`${encoded}/${total}`);
    });
  console.log(Date.now() - now);
  image.toFile("./output/frames.gif");
  image.toFile("./output/frames.webp");
}

async function concatAnimatedGIFs() {
  const image = await GIF.createGif({
    transparent: true,
    maxColors: 32,
    format: "rgb444",
  })
    .addFrame([
      sharp("./1.gif", { animated: true }),
      sharp("./2.gif", { animated: true }),
      sharp("./3.gif", { animated: true }),
    ])
    .toSharp();
  image.toFile("./output/concat.gif");
}

async function readGif() {
  const reader = GIF.readGif(sharp("./2.gif", { animated: true }));
  const frames = await reader.toFrames();
  frames.forEach((frame, index) => {
    frame.toFile(`./output/${("000" + index).substr(-4)}.png`);
  });

  const gif = await reader.toGif({
    transparent: true,
    maxColors: 32,
    format: "rgb444",
  });
  const image = await gif.toSharp();
  image.toFile("./output/remake.gif");
}

// simpleUseCase();
traceEncodingProgress();
concatAnimatedGIFs();
readGif();
