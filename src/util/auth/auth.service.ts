export class AuthService {
  tryLogin(email: string, password: string, saveToken = true) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.id === email && user.password === password);

    if (user) {
      if (saveToken) {
        localStorage.setItem('TMDb-Key', user.password);
      }
    }
   
  }

  tryRegister(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((existingUser: any) => existingUser.id === email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser = { id: email, password: password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
  
}

export const authService = new AuthService();