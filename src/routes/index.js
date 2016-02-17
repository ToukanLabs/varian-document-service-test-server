var express = require('express');
var router = express.Router();
var fs = require('fs');

import config from '../utils/config.js';

/* GET home page. */
router.get('/', function (req, res, next) {
  const uploadedFileNames = fs.readdirSync(config.uploadDir);
  let uploadedFiles = [];

  uploadedFileNames.map((f) => {
    let parts = f.split('_');
    uploadedFiles.push({
      docId: parts[0],
      patientId: parts[1],
      dateOfService: parts[2].split('.')[0],
      fileFormat: parts[2].split('.')[1].toUpperCase(),
      fileName: f,
    });
  });

  res.render('index', { uploadedFiles: uploadedFiles });
});

router.get('/download', function (req, res, next) {

});

module.exports = router;
