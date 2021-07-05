import { FileUpload } from 'graphql-upload';
import { GraphQLError } from 'graphql';
import fs, { ReadStream } from 'fs';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { v4 } from 'uuid';
import { serverUrl } from 'config/vars';

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

export function saveUpload(name: string, data: ReadStream): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const isExist = await exists(path.join(__dirname, '../../uploads'));

      if (!isExist) {
        await mkdir(path.join(__dirname, '../../uploads'));
      }

      const fileName = v4() + name.slice(name.lastIndexOf('.'));

      const stream = fs.createWriteStream(path.join(__dirname, '../../uploads', fileName));
      data.pipe(stream);

      stream.on('finish', () => {
        resolve(`${serverUrl}/uploads/${fileName}`);
      });

      stream.on('error', (e) => {
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function streamBase64(stream: ReadStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.read();

    stream.on('readable', () => {
      const read = stream.read();
      if (read) {
        data += read.toString('base64');
      }
    });
    stream.on('end', () => {
      resolve(data);
    });
    stream.on('error', (e) => {
      reject(e);
    });
  });
}

export async function validateUpload(file: FileUpload) {
  const data = await (file as FileUpload);
  if (!data.mimetype.startsWith('image/')) throw new GraphQLError('Type de fichier unauthorized');
  return data;
}
