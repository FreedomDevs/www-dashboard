class SsoConfig {
  url = 'http://localhost:3000';
  ssoClientID = 'dashboard';
  ssoIntent = 'login';
  ssoCompareUrl = `${this.url}/auth?client_id=${this.ssoClientID}&intent=${this.ssoIntent}`;
}

export const ssoConfig = new SsoConfig();
