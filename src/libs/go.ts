import { navigate } from 'svelte-routing';

export function go(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.location.href = url;
    return;
  }

  navigate(url);
}
