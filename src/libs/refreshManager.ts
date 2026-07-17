export class RefreshManager {
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

    static get(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static set(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    static remove(): void {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    static has(): boolean {
        return this.get() !== null;
    }
}