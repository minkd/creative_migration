var fs = require('fs');
var path = require('path');
var filevault = require("./filevault");
var count = 0;
var input = process.env.INPUT_PATH? process.env.INPUT: "../data/creatives/images"
var index_file = process.env.INDEX_FILE? process.env.INPUT: "../data/creatives/images/index.tsv"
var output_file = process.env.OUTPUT? process.env.OUTPUT: "../data/creatives/output.tsv"
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(index_file)
});

lineReader.on('line', function (line) {

  console.info("Processing line " + count++);
  var arr = line.split("\t");
  var creative_id = arr[0];
  var fileName = arr[1];
  var filePath = path.join(input, fileName);

  fs.stat(filePath, function (error, stat) {
    if (error) {
      fs.appendFile(output_file + '.error', "\nError processing: " + filePath, function (err) {
        if (err) console.error(err);
      });
      return;
    }

    if (stat.isFile()) {
      setTimeout(function() {
        console.log(filePath);

      }, 3000);
      filevault.save(10, filePath, function (err, res) {
        if (err) {
          console.error(err);
        } else if (res) {
          var line = creative_id + "\t" + fileName + "\t" + res.body.id + '\r';
          fs.appendFile(output_file, line, function (err) {
            if (err) console.error(err);
          });
        }
      });
    } else if (stat.isDirectory()) {
      console.log("'%s' is a directory.", filePath);
    }
  });

});