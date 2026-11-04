function clearCookies() {
  const hostParts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < hostParts.length - 1; i++) {
    const domain = hostParts.slice(i).join('.');
    domains.push(`; domain=${domain}`, `; domain=.${domain}`);
  }

  const segments = window.location.pathname.split('/').filter(Boolean);
  const paths = ['/'];
  segments.reduce((acc, seg) => {
    const next = `${acc}/${seg}`;
    paths.push(next);
    return next;
  }, '');

  for (const raw of document.cookie.split(';')) {
    const name = raw.split('=')[0].trim();
    if (!name) continue;

    for (const path of paths) {
      for (const domain of domains) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=${path}${domain}`;
      }
    }
  }
}

const AUTH_FLAG = 'auth';

/** Non-sensitive UI hint only; the real session is an HttpOnly cookie the backend verifies. */
export function isLoggedIn(): boolean {
  return localStorage.getItem(AUTH_FLAG) === '1';
}

export function markLoggedIn() {
  localStorage.setItem(AUTH_FLAG, '1');
}

/** Wipes every piece of client-side session state. HttpOnly cookies can only be cleared by the server. */
export function clearClientSession() {
  localStorage.clear();
  sessionStorage.clear();
  clearCookies();
}

/**
 * Proper logout: revoke the token server-side (best effort), clear the token, cookies,
 * localStorage and sessionStorage, then hard-navigate so no in-memory state survives.
 */
export async function logout(redirectTo = '/login') {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
  } catch {
    // Offline or server down: local cleanup still ends the session on this device.
  }

  clearClientSession();
  window.location.replace(redirectTo);
}
