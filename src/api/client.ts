import axios from 'axios';

// --- CONFIGURACIÓN BASE ---
const BASE_URL = import.meta.env.VITE_API_URL || 'http://167.172.145.102:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- FUNCIONES DE TOKEN (EXPORTADAS) ---
export function getToken(): string | null {
  return localStorage.getItem('bp_token');
}
export function setToken(token: string) {
  localStorage.setItem('bp_token', token);
}
export function clearToken() {
  localStorage.removeItem('bp_token');
  localStorage.removeItem('bp_user');
}

// --- INTERCEPTORES ---
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    const message = error.response?.data?.detail || 'Error en la conexión';
    return Promise.reject(new Error(message));
  }
);

// --- INTERFACES (PARA QUE TYPESCRIPT NO PROTESTE) ---
export interface Usuario { id: number; nombre: string; email: string; negocio?: any; }
export interface Negocio { 
  id: number; nombre: string; slug?: string; telefono?: string; whatsapp?: string;
  direccion?: string; descripcion?: string; logo_url?: string;
  lealtad_activa: boolean; lealtad_sellos_requeridos: number; lealtad_recompensa: string;
  reservas_activas: boolean; reservas_anticipacion_max_dias: number; reservas_cancelacion_horas: number;
  acepta_efectivo: boolean; acepta_transferencia: boolean; acepta_tarjeta: boolean;
  notif_nueva_cita: boolean; notif_recordatorio: boolean; notif_cancelacion: boolean;
  carlos_activa: boolean; carlos_recordatorios_activos: boolean;
}
export interface Servicio { id: number; nombre: string; descripcion?: string; duracion_minutos: number; precio: number; activo: boolean; }
export interface Barbero { id: number; nombre: string; telefono?: string; email?: string; foto_url?: string; activo: boolean; }
export interface Cliente { id: number; nombre: string; telefono?: string; email?: string; sellos: number; sellos_totales: number; recompensas_canjeadas: number; creado_en: string; }
export interface Cita { 
  id: number; fecha_hora: string; duracion_minutos: number; precio: number;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
  notas?: string; creada_por_carlos: boolean;
  fuente?: 'admin' | 'whatsapp' | 'web' | 'wordpress';
  gcal_event_id?: string;
  cliente?: { id: number; nombre: string; telefono?: string };
  barbero?: { id: number; nombre: string };
  servicio?: { id: number; nombre: string; duracion_minutos: number; precio: number };
}
export interface Horario { id: number; dia: string; abierto: boolean; hora_inicio: string; hora_fin: string; }
export interface Conversacion { id: number; telefono: string; nombre_contacto?: string; ultimo_mensaje?: string; ultimo_mensaje_en?: string; no_leidos: number; manejada_por_carlos: boolean; }
export interface Mensaje { id: number; contenido: string; enviado_por: 'cliente' | 'carlos' | 'barberia'; enviado_en: string; leido: boolean; }
export interface InformesStats {
  total_citas: number; completadas: number; ingresos_totales: number; tasa_completadas: number;
  citas_por_estado: Record<string, number>;
  ingresos_por_barbero: Array<{ barbero: string; ingresos: number }>;
}
export interface carlosIndicacion { id: number; texto: string; activa: boolean; creado_en: string; }

// --- SERVICIOS ---
export const auth = {
  login: async (email: string, password: string) => (await api.post('/api/auth/login', { email, password })).data,
  register: async (userData: any) => (await api.post('/api/auth/register', userData)).data,
  me: async () => (await api.get('/api/auth/me')).data,
};

export const dashboard = {
  stats: async () => (await api.get('/api/citas/dashboard')).data,
};

export const citas = {
  listar: async (params?: any) => (await api.get('/api/citas/', { params })).data,
  crear: async (data: any) => (await api.post('/api/citas/', data)).data,
  actualizar: async (id: number, data: any) => (await api.put(`/api/citas/${id}`, data)).data,
  cancelar: async (id: number) => await api.delete(`/api/citas/${id}`),
};

export const negocio = {
  get: async () => (await api.get('/api/negocio/')).data,
  update: async (data: any) => (await api.put('/api/negocio/', data)).data,
  uploadLogo: async (file: File) => {
    const form = new FormData(); form.append('file', file);
    return (await api.post('/api/negocio/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },
};

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

export const informes = {
  stats: async (periodo = '30d', fechaInicio?: string, fechaFin?: string) => {
    const params = { periodo, fecha_inicio: fechaInicio, fecha_fin: fechaFin };
    return (await api.get('/api/informes/', { params })).data;
  },
};

export const lealtad = {
  clientes: async (q?: string) => (await api.get('/api/lealtad/clientes', { params: { q } })).data,
  darSello: async (telefono: string) => (await api.post('/api/lealtad/sello', { telefono })).data,
  resumen: async () => (await api.get('/api/lealtad/resumen')).data,
};

export const conversaciones = {
  listar: async (q?: string) => (await api.get('/api/conversaciones/', { params: { q } })).data,
  mensajes: async (id: number) => (await api.get(`/api/conversaciones/${id}/mensajes`)).data,
  responder: async (id: number, contenido: string) => (await api.post(`/api/conversaciones/${id}/responder`, { contenido })).data,
  sincronizar: async (id: number) => (await api.post(`/api/conversaciones/${id}/sincronizar`)).data,
};

export const carlos = {
  stats: async () => (await api.get('/api/carlos/stats')).data,
  indicaciones: async () => (await api.get('/api/carlos/indicaciones')).data,
  agregarIndicacion: async (texto: string) => (await api.post('/api/carlos/indicaciones', { texto })).data,
  toggleIndicacion: async (id: number, activa: boolean) => (await api.put(`/api/carlos/indicaciones/${id}`, { activa })).data,
  eliminarIndicacion: async (id: number) => await api.delete(`/api/carlos/indicaciones/${id}`),
};

export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}