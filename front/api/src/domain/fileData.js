const database = require('../infra/database');

exports.getFile = async(accessKey) => {
  try {
  	return await database.oneOrNone('select * from public.file where id = $1', [accessKey]);
  } catch(err) {
	  console.log(err);
    return err;
  }
};

exports.saveFile = async (accessKey, value) => {
  try {
    return await database.one('insert into public.file (id, xml) values ($1, $2)', [accessKey, value]);
  } catch(err) {
	  console.log(err);
    return err;
  }
};