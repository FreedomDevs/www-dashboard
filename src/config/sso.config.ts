class SsoConfig {
  url = 'https://sso.elysiac.fun';
  ssoClientID = 'dashboard';
  ssoIntent = 'login';
  ssoCompareUrl = `${this.url}/auth?client_id=${this.ssoClientID}&intent=${this.ssoIntent}`;
}

export const ssoConfig = new SsoConfig();
