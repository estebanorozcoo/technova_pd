import { User, UserRole } from '@/types/user.types';

class UserStore {
  private users: User[] = [];
  private currentId = 1;

  constructor() {
    // Inicializar con algunos usuarios de prueba
    this.users = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@technova.com',
        role: 'admin',
        isActive: true,
        createdAt: Date.now(),
      },
      {
        id: '2',
        username: 'usuario1',
        email: 'usuario1@technova.com',
        role: 'user',
        isActive: true,
        createdAt: Date.now(),
      },
    ];
    this.currentId = 3;
  }

  // Simular log de llamada HTTP
  private logHttpCall(method: string, endpoint: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log('\n ========== HTTP REQUEST ==========');
    console.log(` Timestamp: ${timestamp}`);
    console.log(` Method: ${method}`);
    console.log(` Endpoint: ${endpoint}`);
    if (data) {
      console.log(` Data:`, JSON.stringify(data, null, 2));
    }
    console.log('=====================================\n');
  }

  // Listar todos los usuarios
  list(): User[] {
    this.logHttpCall('GET', '/api/users');
    console.log(` Usuarios encontrados: ${this.users.length}`);
    return [...this.users]; // Retornar copia para evitar mutaciones
  }

  // Buscar usuario por username
  findByUsername(username: string): User | undefined {
    this.logHttpCall('GET', `/api/users/search?username=${username}`);
    const user = this.users.find(u => u.username === username);
    
    if (user) {
      console.log(` Usuario encontrado: ${user.username}`);
    } else {
      console.log(` Usuario no encontrado: ${username}`);
    }
    
    return user ? { ...user } : undefined;
  }

  // Crear nuevo usuario con propiedades por defecto
  create(userData: Partial<User>): User {
    this.logHttpCall('POST', '/api/users', userData);

    // Validaciones
    if (!userData.username || !userData.email) {
      console.error(' Error: username y email son obligatorios');
      throw new Error('Username y email son obligatorios');
    }

    // Verificar username duplicado
    if (this.findByUsername(userData.username)) {
      console.error(` Error: El username "${userData.username}" ya existe`);
      throw new Error(`El username "${userData.username}" ya existe`);
    }

    // Aplicar propiedades por defecto
    const newUser: User = {
      id: String(this.currentId++),
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user', // Default: 'user'
      isActive: userData.isActive !== undefined ? userData.isActive : true, // Default: true
      createdAt: Date.now(), // Default: timestamp actual
    };

    this.users.push(newUser);
    console.log(` Usuario creado exitosamente: ${newUser.username} (ID: ${newUser.id})`);
    console.log(` Propiedades por defecto aplicadas: role="${newUser.role}", isActive=${newUser.isActive}`);
    
    return { ...newUser };
  }

  // Actualizar usuario existente
  update(id: string, updates: Partial<User>): User | null {
    this.logHttpCall('PATCH', `/api/users/${id}`, updates);

    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      console.error(` Error: Usuario con ID ${id} no encontrado`);
      return null;
    }

    // Verificar username duplicado si se está actualizando
    if (updates.username) {
      const existingUser = this.findByUsername(updates.username);
      if (existingUser && existingUser.id !== id) {
        console.error(` Error: El username "${updates.username}" ya existe`);
        throw new Error(`El username "${updates.username}" ya existe`);
      }
    }

    // Actualizar usuario
    this.users[index] = {
      ...this.users[index],
      ...updates,
      id, // Asegurar que el ID no cambie
    };

    console.log(` Usuario actualizado: ${this.users[index].username} (ID: ${id})`);
    return { ...this.users[index] };
  }

  // Eliminar usuario
  remove(id: string): boolean {
    this.logHttpCall('DELETE', `/api/users/${id}`);

    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      console.error(` Error: Usuario con ID ${id} no encontrado`);
      return false;
    }

    const deletedUser = this.users.splice(index, 1)[0];
    console.log(` Usuario eliminado: ${deletedUser.username} (ID: ${id})`);
    
    return true;
  }

  // Método auxiliar para validar credenciales (para login)
  validateCredentials(username: string, password: string): User | null {
    this.logHttpCall('POST', '/api/auth/login', { username, password: '***' });

    const user = this.findByUsername(username);
    
    if (!user) {
      console.error(' Login fallido: Usuario no encontrado');
      return null;
    }

    if (!user.isActive) {
      console.error(' Login fallido: Usuario inactivo');
      return null;
    }

    // Simulación simple: password = username + "123"
    const isValidPassword = password === `${username}123`;
    
    if (!isValidPassword) {
      console.error(' Login fallido: Contraseña incorrecta');
      return null;
    }

    console.log(` Login exitoso: ${user.username}`);
    return { ...user };
  }
}

// Exportar instancia singleton
export const userStore = new UserStore();