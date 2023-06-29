const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
const segmentWriteKey = process.env.REACT_APP_SEGMENT;

fs.readFile(indexHtmlPath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/SEGMENT_WRITE_KEY/g, segmentWriteKey);

  fs.writeFile(indexHtmlPath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
