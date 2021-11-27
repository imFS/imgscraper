var Xray = require("x-ray");
var down = require("download");
var fs = require("fs");
const ver = "0.1";

var xray = new Xray();

function getLastPart(str, delimiter) {
  if (str[str.length - 1] == "/") {
    str = str.substring(0, str.length - 1);
  }
  return str.substring(str.lastIndexOf(delimiter) + 1);
}
function scrapeImgs(url, path) {
  path = path.replaceAll("\\", "/");
  var name = getLastPart(url, "/");
  console.log(`⏳${name}🍳`);
  xray(url, "img", [
    {
      img: "",
      src: "@src",
    },
  ])(function (err, result) {
    var imgs = result;
    var localpaths = [];

    var promises = [];
    promises.push(
      imgs.map(function (img) {
        if (name) {
          const imgpath = path + name + "/"; //+ getLastPart(img.src, "/");
          //console.log(imgpath);
          const filename = getLastPart(img.src, "/");
          localpaths.push(filename);
          if (!fs.existsSync(imgpath + filename)) {
            var p = down(img.src, imgpath);
            promises.push(p);
          }
        }
      })
    );

    Promise.all(promises).then(() => {
      const indexpath = htmlPageGen(name, localpaths, path);
      console.log(`✅ | ${name} | Index page: "${indexpath}"`);
    });
  });
}
module.exports = {
  scrape: scrapeImgs,
};
function htmlPageGen(title, imgs, path) {
  var html =
    "<!DOCTYPE html>\n\
    <head>\n<title>" +
    title +
    '</title>\n</head>\n\
    <body style="word-wrap: break-word;">\n \
    <h2>' +
    title +
    "</h2>\n<h4>Generated by FS Scraper " +
    ver +
    "</h4>\n";

  imgs.map(function (img) {
    html +=
      '<img src="' +
      path +
      title +
      "/" +
      img +
      '" width="728" height="auto;" border="0"></img>\n';
  });

  // Convert last char to num and +1
  let nc = Number(title.substring(title.length - 1)) + 1;
  let nd = title.substring(0, title.length - 1);
  html += "\n</br><p>[Next chapters] (Experimental)</p>\n";

  let i = nc - 1;
  if (nc - 2 >= 0) {
    i = nc - 2;
  }
  for (; i < nc + 4; i++) {
    if (i == nc - 1) {
      html += "<b>";
    }
    html += '<a href="' + path + nd + i + '/index.htm">' + i + "</a>";
    if (i == nc - 1) {
      html += "</b>";
    }

    html += "\n";
  }

  html += "</body>\n</html>";

  var indexpath = path + title + "/index.htm";
  fs.writeFile(indexpath, html, function (err) {
    if (err) console.log("GenFile write error: ", err);
  });

  return indexpath;
}
