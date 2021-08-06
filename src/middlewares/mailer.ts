import axios from 'axios';
import path from 'path';

import { clientUrl, sendingBlueApiKey } from 'config/vars';

const baseUrl = 'https://api.sendinblue.com/v3/smtp/email';

export default function (
  id: number,
  to: string,
  name: string,
  url: string,
  params: Record<string, any>,
  subject: string,
) {
  const options = {
    sender: {
      name: 'Diagoriente',
      email: 'contact@diagoriente.beta.gouv.fr',
    },
    to: [{ email: to, name }],
    replyTo: {
      name: 'diagoriente',
      email: 'contact@diagoriente.beta.gouv.fr',
    },
    params: {
      LIEN: path.join(clientUrl, url),
      ...params,
    },
    subject: subject,
    templateId: id,
  };

  return axios.post(baseUrl, JSON.stringify(options), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': sendingBlueApiKey,
    },
  });
}
