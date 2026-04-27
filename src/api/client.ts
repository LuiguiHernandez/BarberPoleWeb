import axios from 'axios';

// --- CONFIGURACIÓN BASE ---

const BASE_URL = import.meta.env.VITE_API_URL || 'http://167.172.145.102:8000';

// Creamos la instancia central de Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTORES ---

// Interceptor de Petición: Agrega el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuesta: Maneja errores globales (como el 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bp_token');
      localStorage.removeItem('bp_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Extraemos el mensaje de error de FastAPI si existe
    const message = error.response?.data?.detail || 'Error en la conexión';
    return Promise.reject(new Error(message));
  }
);

// --- SERVICIOS ---

// AUTH
export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },
  me: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
};

// DASHBOARD
export const dashboard = {
  stats: async () => {
    const { data } = await api.get('/api/citas/dashboard');
    return data;
  },
};

// CITAS
export const citas = {
  listar: async (params?: { fecha?: string; vista?: string; barbero_id?: number }) => {
    const { data } = await api.get('/api/citas/', { params });
    return data;
  },
  crear: async (data: any) => {
    const { data: res } = await api.post('/api/citas/', data);
    return res;
  },
  actualizar: async (id: number, data: any) => {
    const { data: res } = await api.put(`/api/citas/${id}`, data);
    return res;
  },
  cancelar: async (id: number) => {
    await api.delete(`/api/citas/${id}`);
  },
};

// NEGOCIO
export const negocio = {
  get: async () => {
    const { data } = await api.get('/api/negocio/');
    return data;
  },
  update: async (data: any) => {
    const { data: res } = await api.put('/api/negocio/', data);
    return res;
  },
  uploadLogo: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    // Para archivos usamos una config diferente en el header
    const { data } = await api.post('/api/negocio/logo', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
};

// SERVICIOS, BARBEROS, HORARIOS (Patrón simplificado)
export const servicios = {
  listar: async () => (await api.get('/api/servicios/')).data,
  crear: async (data: any) => (await api.post('/api/servicios/', data)).data,
  actualizar: async (id: number, data: any) => (await api.put(`/api/servicios/${id}`, data)).data,
  eliminar: async (id: number) => await api.delete(`/api/servicios/${id}`),
};

export const barberos = {
  listar: async () => (await api.get('/api/barberos/')).data,
  crear: async (data: any) => (await api.post('/api/barberos/', data)).data,
  actualizar: async (id: number, data: any) => (await api.put(`/api/barberos/${id}`, data)).data,
  eliminar: async (id: number) => await api.delete(`/api/barberos/${id}`),
};

export const horarios = {
  listar: async () => (await api.get('/api/horarios/')).data,
  actualizar: async (data: any[]) => (await api.put('/api/horarios/', data)).data,
};

// LEALTAD Y CONVERSACIONES
export const lealtad = {
  clientes: async (q?: string) => (await api.get('/api/lealtad/clientes', { params: { q } })).data,
  darSello: async (telefono: string) => (await api.post('/api/lealtad/sello', { telefono })).data,
  resumen: async () => (await api.get('/api/lealtad/resumen')).data,
};

export const conversaciones = {
  listar: async (q?: string) => (await api.get('/api/conversaciones/', { params: { q } })).data,
  mensajes: async (id: number) => (await api.get(`/api/conversaciones/${id}/mensajes`)).data,
  responder: async (id: number, contenido: string) => (await api.post(`/api/conversaciones/${id}/responder`, { contenido })).data,
};

// LUNA IA
export const luna = {
  stats: async () => (await api.get('/api/luna/stats')).data,
  indicaciones: async () => (await api.get('/api/luna/indicaciones')).data,
  agregarIndicacion: async (texto: string) => (await api.post('/api/luna/indicaciones', { texto })).data,
  toggleIndicacion: async (id: number, activa: boolean) => (await api.put(`/api/luna/indicaciones/${id}`, { activa })).data,
  eliminarIndicacion: async (id: number) => await api.delete(`/api/luna/indicaciones/${id}`),
};

// HELPERS
export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}