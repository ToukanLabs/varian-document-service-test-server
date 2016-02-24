var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

import config from '../utils/config.js';

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir);
}

router.get('/Ping', function (req, res, next) {
  res.json({ success: 'true' });
});

router.post('/:patientIdBase64/Document', function (req, res, next) {
  const patientIdDecoded = new Buffer(req.params.patientIdBase64, 'base64').toString('ascii');
  const prefix = patientIdDecoded.substring(0, 1);
  const patientId = patientIdDecoded.substring(1);
  const binaryContent = req.body.BinaryContent;
  const fileFormat = req.body.FileFormat;
  const dateOfService = req.body.DateOfService;

  console.log('\tPatient ID Decoded: ' + patientIdDecoded);
  console.log('\tPatient ID Prefix: ' + prefix);
  console.log('\tPatient ID: ' + patientId);
  console.log('\tBinaryContent: ' + binaryContent.substring(0, 20) + '...');
  console.log('\tFileFormat: ' + fileFormat);
  console.log('\tDateOfService: ' + dateOfService);

  const authenticationDecoded = new Buffer(req.headers.authorization, 'base64').toString('ascii');
  const authenticationParts = authenticationDecoded.split('\t');
  const username = authenticationParts[0];
  const password = authenticationParts[1];

  if (username !== config.username || password !== config.password) {
    res.status(400);
    res.json({
      ErrorCode: 'ECB_002',
      ErrorMessage: 'The Authentication header is not valid. It should be of the form: <userId>;<password> or \'\''
    });
    return;
  }

  // If the decoded patient ID doesnt start with a #, ! or $ return 404.
  if (prefix.match(/#|!|\$/) === null) {
    res.status(404)
        .send('Endpoint not found.');
    return;
  }
  const docId = '' + (fs.readdirSync(config.uploadDir).length + 1);
  const pad = '00000';
  const paddedDocId = pad.substring(0, pad.length - docId.length) + docId;
  const dateOfServiceSlug = dateOfService.replace(/:/g, '--');
  const fileName = `${paddedDocId}_${patientId}_${dateOfServiceSlug}.${fileFormat}`;

  const filePath = path.join(config.uploadDir, fileName);

  fs.writeFile(filePath, req.body.BinaryContent, 'base64', function (err) {
    if (err) {
      console.log(err);
    }
  });

  res.json({
    PtId: patientId,
    PtVisitId: 1,
    PtVisitNoteId: docId
  });
});

module.exports = router;
