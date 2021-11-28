var img_scraper = require("./iscr");
var fs = require("fs");

// Vars~
let homePath = "elite_class_manga";
let savePath = __dirname + "\\" + homePath + "\\";
let pageDelay = 5;

// TODOS: Code cleanup/optimization

async function sleep(i) {
  await new Promise((r) => setTimeout(r, i * 1000));
}

// Generates an homepage for chapter overview
function homeGen(start, end) {
  let chapterPath = "classroom-of-the-elite-chapter";

  let html =
    "<!DOCTYPE html><head><title>" + homePath + "</title></head><body>";
  for (let index = start; index < end; index++) {
    html +=
      "<a href='./" +
      chapterPath +
      "-" +
      index +
      "/index.htm'>Chapter " +
      index +
      "</a></br>";
  }
  html += "</body></html>";

  var indexpath = savePath + "index.htm";
  fs.writeFile(indexpath, html, function (err) {
    if (err) console.log("GenFile write error: ", err);
  });
}

// Downloads chapters
async function downloadChapters(start, end) {
  for (let index = start; index < end; index++) {
    var url = `https://classroomoftheelite.com/manga/classroom-of-the-elite-chapter-${index}/`;
    //console.log(url);
    img_scraper.scrape(url, savePath);

    if (index % 3 == 0) await sleep(pageDelay);
  }
}

// Main
async function main() {
  let start = 1;
  let end = 49;

  downloadChapters(start, end);
  homeGen(start, end);
}

main();
