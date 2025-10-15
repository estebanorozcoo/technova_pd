import { userStore } from '@/lib/userStore';
import { User, LoginCredentials } from '@/types/user.types';

class AuthService {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log(' Intentando login para:', credentials.username);

      // Validaciones básicas
      if (!credentials.username || credentials.username.trim() === '') {
        throw new Error('El nombre de usuario es obligatorio');
      }

      if (!credentials.password || credentials.password.trim() === '') {
        throw new Error('La contraseña es obligatoria');
      }

      // Simular delay de red (opcional, para UX más realista)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validar credenciales usando UserStore
      const user = userStore.validateCredentials(
        credentials.username,
        credentials.password
      );

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // En una app real, aquí guardarías el token
      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(user));

      console.log(' Login exitoso:', user.username);
      return user;

    } catch (error: any) {
      console.error(' Error en login:', error.message);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    console.log(' Cerrando sesión');
    
    // En una app real, limpiarías el token
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
  }

  /**
   * Verificar si hay sesión activa
   */
  checkSession(): User | null {
    try {
      // En una app real, verificarías el token
      // const userStr = localStorage.getItem('user');
      // if (userStr) {
      //   return JSON.parse(userStr);
      // }
      return null;
    } catch (error) {
      console.error(' Error verificando sesión:', error);
      return null;
    }
  }

  /**
   * Obtener usuario actual (mock)
   */
  getCurrentUser(): User | null {
    return this.checkSession();
  }
}

// Exportar instancia singleton
export const authService = new AuthService();