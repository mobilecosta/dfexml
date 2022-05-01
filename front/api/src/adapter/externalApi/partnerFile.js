const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const parser = require('xml2json');
const { response } = require('../../app');

const fileData = require('../../domain/fileData');

dotenv.config();

exports.getPartnerFile = async () => {
  const options = { headers: { 'Content-Type': 'application/json',
                               'X-Api-Id': process.env.PARTNER_API_ID,
                               'X-Api-Key': process.env.PARTNER_API_KEY
                              }
                            };
							
  await axios.get(process.env.PARTNER_URL, options)
    .then((res) => {
      // Receive api data
      const files = res.data.data;
      for (file of files) {
        const accessKey = `{${file['access_key']}}`;
        
        // Transform xml file to JSON file
        fs.writeFileSync('./assets/example.xml', (Buffer.from(file.xml, 'base64')));

        fs.readFile('./assets/example.xml', async (err, data) => {
          const file = JSON.parse(parser.toJson(data, {reversible: true}));
          const value = file.nfeProc.NFe.infNFe.Id;

          // Send to save on DB
          let response = await fileData.getFile(accessKey);
          if (!response) {
            response = await fileData.saveFile(value, '');
            if (response || err) {
              return response;
            }
          }
        });
      };

      return null;
    })
    .catch((err) => {
      return err;
    });
};