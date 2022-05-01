const express = require('express');

const FileRoute = express.Router();

const fileService = require('../adapter/service/fileService');

FileRoute.get('/file/value', async (req, res) => {
  const accessKey = `{${req.query.accessKey}}`;
  const fileData = await fileService.getFile(accessKey);
  if (!fileData) {
    return res.status(400).json({ message: 'Error', value: 'Not found any file with this accessToken'})
  }

  return res.status(200).json({ message: 'Success', value: fileData.value})
});

FileRoute.post('/file/partner', async (_, res) => {
  const response = await fileService.saveFiles();
  if (response) {
    return res.status(400).json({ message: 'Error', value: 'Error to try get and save files from partner'})
  }

  return res.status(201).json({ message: 'Success', value: 'All files were created'})
});

module.exports = FileRoute;