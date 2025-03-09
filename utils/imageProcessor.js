const Jimp = require("jimp");

async function appendImages(image1, image2, outputPath) {
  const img1 = await Jimp.read(`uploads/${image1}`);
  const img2 = await Jimp.read(`uploads/${image2}`);

  const newHeight = img1.getHeight() + img2.getHeight();
  const mergedImage = new Jimp(img1.getWidth(), newHeight);

  mergedImage.composite(img1, 0, 0);
  mergedImage.composite(img2, 0, img1.getHeight());

  await mergedImage.writeAsync(outputPath);
}

module.exports = { appendImages };
