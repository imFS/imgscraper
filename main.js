var img_scraper = require("./iscr");

let savePath = __dirname + "\\elite_class_manga\\";
let pageDelay = 1;

// TODOS: Change 'pages' option below and maybe use 'split' to split by '-' to avoid double digit problem because current method takes single char/last char only.

async function sleep(i) {
  await new Promise((r) => setTimeout(r, i * 1000));
}
// Main
async function main() {
  for (let index = 1; index < 15; index++) {
    var url = `https://classroomoftheelite.com/manga/classroom-of-the-elite-chapter-${index}/`;
    //console.log(url);
    img_scraper.scrape(url, savePath);
    await sleep(pageDelay);
  }
}

main();
