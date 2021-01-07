import { domain, clientId, apiUri } from '../../auth_config.json';

export const environment = {
  production: false,
  auth: {
    domain,
    clientId,
    redirectUri: window.location.origin,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
