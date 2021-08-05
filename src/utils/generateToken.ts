import axios from 'axios';
import qs from 'querystring';
import { GRANT_TYPE, CLIENT_ID, CLIENT_SECRET, SCOPES } from 'config/vars';

export default async () => {
  const data = {
    grant_type: GRANT_TYPE,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: SCOPES,
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      realm: '/partenaire',
    },
  };

  const result = await axios.post(
    'https://entreprise.pole-emploi.fr/connexion/oauth2/access_token',
    qs.stringify(data),
    config,
  );

  return result.data;
};
