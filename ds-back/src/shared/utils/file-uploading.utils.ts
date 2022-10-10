import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const readerFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|epub|png|jpg)$/)) {
    return callback(
      new Error('Only images and readable files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);
  const randomName = uuidv4();
  callback(null, `${name}-${randomName}${fileExtName}`);
};
