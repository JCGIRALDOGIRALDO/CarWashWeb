import { jwtDecode } from 'jwt-decode';

export function getUserRoleFromToken(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded?.role || null;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}
