# Varian Document Service Test Server

This intends to copy the API from the Varian Document Service provided by te ARIA Oncology Information System so that you can test integration without requiring the ARIA software to be installed.

# URLs

## /

View the documents that hae been uploaded.

# API Endpoints

## GET /DocumentService/Ping

Checks if the service is running

### Request

N/A

### Response

`{ "success": "true" }`


## POST /DocumentService/{patientID}/Document

POSTs a document for the given patient to be stored by the document service.

`{patientID}` is a base64 encoded `#`, `!` or `$` followed by the patientID.

### Request

Headers:
* Content-Type: application/json
* Authorization: <base64 encoded username\tpassword>

Body:
```
{
  "BinaryContent": <base64 encoded document>,
  "FileFormat": <TXT, DOC, DOCX, RTF, BMP, GIF, JPG, PNG, TIF, XML or PDF>
  "DateOfService": "2016-02-09T11:01:12"
}
```

### Response
```
{
  "PtId": <patientId>,
  "PtVisitId": 1,
  "PtVisitNoteId": <documentId>
}
```
