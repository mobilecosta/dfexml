const fileData = require('../../domain/fileData');
const partnerFiles = require('../../adapter/externalApi/partnerFile');

exports.getFile = (accessKey) => {
	return fileData.getFile(accessKey);
};

exports.saveFiles = async () => {
	return await partnerFiles.getPartnerFile();
};