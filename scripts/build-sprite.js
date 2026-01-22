const svgSprite = require("svg-sprite");
const fs = require("fs");
const path = require("path");

const config = {
  mode: {
    symbol: {
      sprite: "sprite.svg",
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          plugins: [
            {
              name: "removeAttrs",
              params: { attrs: "(fill|stroke|width|height)" },
            },
          ],
        },
      },
    ],
  },
};

const sprite = new svgSprite(config);

const iconsDir = path.join(process.cwd(), "app/ui/icons");
const files = fs.readdirSync(iconsDir);

files.forEach((file) => {
  const content = fs.readFileSync(path.join(iconsDir, file));
  sprite.add(file, file, content);
});

sprite.compile((err, result) => {
  if (err) throw err;

  fs.writeFileSync(
    path.join(process.cwd(), "public/sprite.svg"),
    result.symbol.sprite.contents
  );

  console.log("✅ SVG sprite generated");
});
