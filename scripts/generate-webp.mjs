import sharp from 'sharp';

const tasks = [
  ['public/brand/logo apollo 11 teste.png', 'public/brand/logo-apollo-11.webp', 1400, 72],
  ['public/teste 2.png', 'public/teste-2.webp', 1600, 74],
  ['public/members/Apolo Bagattini.png', 'public/members/apolo-bagattini.webp', 1400, 72],
  ['public/members/Luiz Avelar.png', 'public/members/luiz-avelar.webp', 1400, 72],
  ['public/members/Luiz Villanacci.png', 'public/members/luiz-villanacci.webp', 1400, 72],
  ['public/space/terra.png', 'public/space/terra.webp', 1200, 70],
  ['public/space/marte.png', 'public/space/marte.webp', 1200, 70],
  ['public/space/jupiter.png', 'public/space/jupiter.webp', 1400, 70],
  ['public/space/saturno.png', 'public/space/saturno.webp', 1600, 70],
  ['public/space/astronauta.png', 'public/space/astronauta.webp', 1000, 72],
  ['public/space/rocket.png', 'public/space/rocket.webp', 1000, 72],
  ['public/galeria/DSC00028.jpg', 'public/galeria/DSC00028.webp', 1800, 74],
  ['public/galeria/DSC04939.jpg', 'public/galeria/DSC04939.webp', 1800, 74],
  ['public/galeria/DSC04950.jpg', 'public/galeria/DSC04950.webp', 1800, 74],
  ['public/galeria/DSC04959.jpg', 'public/galeria/DSC04959.webp', 1800, 74],
  ['public/galeria/DSC04996.jpg', 'public/galeria/DSC04996.webp', 1800, 74],
  ['public/galeria/DSC05003.jpg', 'public/galeria/DSC05003.webp', 1800, 74],
  ['public/galeria/DSC05060.jpg', 'public/galeria/DSC05060.webp', 1800, 74],
];

for (const [input, output, width, quality] of tasks) {
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);

  console.log(output);
}
