import axios, { AxiosError } from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (agregar token, logs, etc.)
api.interceptors.request.use(
  (config) => {
    console.log(` ${config.method?.toUpperCase()} ${config.url}`);
    
    // Aquí podrías agregar token de autenticación
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error(' Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejo global de errores)
api.interceptors.response.use(
  (response) => {
    console.log(` ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(' Error en response:', error.message);
    
    // Manejo de errores común
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      const data: any = error.response.data;
      
      switch (status) {
        case 400:
          console.error(' Bad Request:', data.message);
          break;
        case 401:
          console.error(' No autorizado');
          // Redireccionar a login si es necesario
          break;
        case 404:
          console.error(' No encontrado:', data.message);
          break;
        case 409:
          console.error(' Conflicto:', data.message);
          break;
        case 500:
          console.error(' Error del servidor:', data.message);
          break;
        default:
          console.error(` Error ${status}:`, data.message);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error(' Sin respuesta del servidor');
    } else {
      // Error al configurar la petición
      console.error(' Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;