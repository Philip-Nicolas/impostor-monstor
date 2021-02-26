const { createCanvas, registerFont, Image } = require('canvas')
const fs = require('fs')

// DISCORD FONTS
// font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;

registerFont("fonts/Whitney.ttf",
  {
    family: "Whitney",
    weight: 400,
  })

const getStringDimensions = (s, font) => {
  const canvas = createCanvas(0, 0)
  const ctx = canvas.getContext('2d')
  ctx.font = font
  return ctx.measureText(s)
}

const makeCanvasFromString = (s, font) => {
  const metrics = getStringDimensions(s, font)

  // const canvas = createCanvas(metrics.width, 15)
  const canvas = createCanvas(metrics.width, metrics.emHeightAscent)
  const ctx = canvas.getContext('2d')

  ctx.font = font
  ctx.fillStyle = 'black';
  ctx.fillText(s, 0, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + metrics.alphabeticBaseline)

  return canvas;
}

const makePNGStreamFromString = (s, font) => {
  return makeCanvasFromString(s, font).createPNGStream()
}

const makeBufferFromString = (s, font) => {
  return makeCanvasFromString(s, font).toBuffer("raw")
}

const drawPNGStream = (stream, name) => {
  const out = fs.createWriteStream(__dirname + "/out/" + name + ".png")
  stream.pipe(out)
}

const combos = (a) => {
  res = []
  a.forEach((e1, i1) =>
    a.forEach((e2, i2) => {
      if (i1 < i2) res.push([e1, e2]);
    })
  );
  return res
}

const normEq = (pair, normType) => pair[0].normalize(normType) === pair[1].normalize(normType)

const imgEq = (pair) => {
  b1 = makeBufferFromString(pair[0].normalize("NFKD"), discordFont)
  b2 = makeBufferFromString(pair[1].normalize("NFKD"), discordFont)
  return b1.equals(b2)
}

const lenEq = (pair) => pair[0].length === pair[1].length

const discordFont = '12px Whitney Book, Arial, Segoe UI Symbol, SimSun';

// test examples
const confusables = new Map([
  ["ZWNJ", "ffi​lo"],
  ["cyrillic", "ffilо"],
  ["ZWS", "ffi​lo"],
  ["ligature", "ﬀilo"],
  ["latin", "ffilo"],
]);


// const strings = ["a", "b", "c", "d"];
drawPNGStream(makePNGStreamFromString("ミント", discordFont), "test")
drawPNGStream(makePNGStreamFromString(" ٴۢ", discordFont), "test_1")
drawPNGStream(makePNGStreamFromString("˞˞˞˞˞˞˞˞˞˞˞˞˞˞˞˞˞˞", discordFont), "test_2")
// drawPNGStream(makePNGStreamFromString("mKg", discordFont), "test")
// res = combos([...impostor-monstor.values()]).map(pair => `${pair[0]} ${pair[1]}`.padEnd(18) + `\t ${
//   // normEq(pair, "NFKD") ||
//   // normEq(pair, "NFD") ||
//   // lenEq(pair) ||
//   imgEq(pair) ||
//   "F"}`).join("\n")
// // res = combos(strings).map(pair => `${pair[0]} ${pair[1]}\t ${imgEq(pair)}`).join("\n")
// // res = combos(["a", "a"]).map(pair => `${pair[0]} ${pair[1]}\t ${normEq(pair, "NFKD")}`).join("\n")
// // res = combos(strings).map(pair => `${pair[0]} ${pair[1]}\t ${normEq(pair, "NFKD")}`).join("\n")
// console.log(res)