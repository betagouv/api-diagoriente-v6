import Parser from 'ua-parser-js';

import { UserDocument, Role } from 'models/user.model';
import RefreshToken from 'models/refreshToken.model';
import { LocalRequest } from 'crud/apiWrapper';

const privileges: { [K in Role]?: Role[] } = {};

function isValidRole(role: Role, user?: UserDocument) {
  return role === user?.role || Boolean(privileges[role]?.find((r) => r === user?.role));
}

export function isUserAuthenticated(request: LocalRequest, role: Role[] = []) {
  if (!request.user && role.length) return false;
  if (role.length && !role.find((r) => isValidRole(r, request.user))) return false;
  return true;
}

export function getAgent(req: LocalRequest) {
  const userAgent = new Parser(req.headers['user-agent']);
  return `${userAgent.getOS().name} ${userAgent.getBrowser().name}`;
}

export async function generateTokenResponse(user: UserDocument, req: LocalRequest) {
  try {
    const tokenType = 'Bearer';
    const { token: accessToken, expiresIn } = user.generateToken();
    const generateToken = await RefreshToken.generate(user, getAgent(req));
    const refreshToken = generateToken.token;
    return {
      tokenType,
      accessToken,
      refreshToken,
      expiresIn,
    };
  } catch (e) {
    throw e;
  }
}
