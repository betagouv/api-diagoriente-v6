import { escapeRegExp } from 'lodash';

export const objectIdReg = /^[0-9a-fA-F]{24}$/;

export const jwtReg = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export function reg(str: string, flag: string | undefined = 'i') {
  return new RegExp(escapeRegExp(str), flag);
}
