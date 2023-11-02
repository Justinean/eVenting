import decode from 'jwt-decode';

interface FetchDataType {
  accessToken: string;
  refreshToken?: string;
}

class AuthService {
  // Obtains user data.
  getProfile(): TokenShape {
    return decode(this.getToken() as string);
  }

  // Checks if the user is logged in.
  loggedIn() {
    // Checks if a token exists and is still valid.
    const token = this.getRefreshToken();
    return !!token;
  }

  // Checks if token is expired.
  isTokenExpired() {
    try {
      if (!this.getToken) return true;
      const decoded: TokenShape = decode(this.getToken() as string);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  // Gets our token from local storage.
  getToken() {
    return localStorage.getItem('id_token');
  }

  getRefreshToken() {
    return localStorage.getItem('id_token2');
  }

  refreshToken() {
    return new Promise<string | null>((resolve, reject) => {
      fetch("/api/auth/token", {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token: this.getRefreshToken()})}).then((res: Response) => res.json()).then((data: FetchDataType) => {
        if (data.accessToken) {
          this.login(data.accessToken, data.refreshToken);
          resolve(data.accessToken);
        } else {
          reject();
        }
      }).catch((err: Error) => {
        console.error(err);
        reject();
      })
    })
  } 

  // Logs us in and saves the user token to localStorage.
  login(idToken: string, idToken2?: string) {
    localStorage.setItem('id_token', idToken);
    if (idToken2) localStorage.setItem('id_token2', idToken2);
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('id_token2');
    // Reloads the page and resets the state of the application.
    window.location.assign('/');
  }
}

export default (new AuthService() as AuthServiceType);