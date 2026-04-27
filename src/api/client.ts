const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function getToken(): string | null {
  return localStorage.getItem('bp_token')
}
export function setToken(token: string) {
  localStorage.setItem('bp_token', token)
}
export function clearToken() {
  localStorage.removeItem('bp_token')
  localStorage.removeItem('bp_user')
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (res.status === 401) {
    clearToken()
    window.location.href = '/login'
    throw new Error('No autorizado')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// AUTH
export const auth = {
  login: (email: string, password: string) =>
    apiFetch<{ access_token: string; usuario_nombre: string; negocio_nombre: string; negocio_slug: string }>(
      'api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  register: (data: { nombre: string; email: string; password: string; nombre_negocio: string }) =>
    apiFetch<{ access_token: string; usuario_nombre: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => apiFetch<{ id: number; nombre: string; email: string; negocio: any }>('/api/auth/me'),
}

// DASHBOARD
export const dashboard = {
  stats: () => apiFetch<{ citas_hoy: number; ingresos_hoy: number; citas_semana: number; confirmadas_hoy: number }>('/api/citas/dashboard'),
}

// CITAS
export interface Cita {
  id: number; fecha_hora: string; duracion_minutos: number; precio: number
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio'
  notas?: string; creada_por_luna: boolean
  cliente?: { id: number; nombre: string; telefono?: string }
  barbero?: { id: number; nombre: string }
  servicio?: { id: number; nombre: string; duracion_minutos: number; precio: number }
}
export const citas = {
  listar: (params?: { fecha?: string; vista?: string; barbero_id?: number }) => {
    const q = new URLSearchParams()
    if (params?.fecha) q.set('fecha', params.fecha)
    if (params?.vista) q.set('vista', params.vista)
    if (params?.barbero_id) q.set('barbero_id', String(params.barbero_id))
    return apiFetch<Cita[]>(`/api/citas/?${q}`)
  },
  crear: (data: any) => apiFetch<Cita>('/api/citas/', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id: number, data: any) => apiFetch<Cita>(`/api/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancelar: (id: number) => apiFetch<void>(`/api/citas/${id}`, { method: 'DELETE' }),
}

// NEGOCIO
export interface Negocio {
  id: number; nombre: string; slug?: string; telefono?: string; whatsapp?: string
  direccion?: string; descripcion?: string; logo_url?: string
  lealtad_activa: boolean; lealtad_sellos_requeridos: number; lealtad_recompensa: string
  reservas_activas: boolean; reservas_anticipacion_max_dias: number; reservas_cancelacion_horas: number
  acepta_efectivo: boolean; acepta_transferencia: boolean; acepta_tarjeta: boolean
  notif_nueva_cita: boolean; notif_recordatorio: boolean; notif_cancelacion: boolean
  luna_activa: boolean; luna_recordatorios_activos: boolean
}
export const negocio = {
  get: () => apiFetch<Negocio>('/api/negocio/'),
  update: (data: Partial<Negocio>) => apiFetch<Negocio>('/api/negocio/', { method: 'PUT', body: JSON.stringify(data) }),
  uploadLogo: (file: File) => {
    const form = new FormData(); form.append('file', file)
    const token = getToken()
    return fetch(`${BASE_URL}/api/negocio/logo`, {
      method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form,
    }).then(r => r.json()) as Promise<{ logo_url: string }>
  },
}

// SERVICIOS
export interface Servicio { id: number; nombre: string; descripcion?: string; duracion_minutos: number; precio: number; activo: boolean }
export const servicios = {
  listar: () => apiFetch<Servicio[]>('/api/servicios/'),
  crear: (data: Omit<Servicio, 'id'>) => apiFetch<Servicio>('/api/servicios/', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id: number, data: Partial<Servicio>) => apiFetch<Servicio>(`/api/servicios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id: number) => apiFetch<void>(`/api/servicios/${id}`, { method: 'DELETE' }),
}

// BARBEROS
export interface Barbero { id: number; nombre: string; telefono?: string; email?: string; foto_url?: string; activo: boolean }
export const barberos = {
  listar: () => apiFetch<Barbero[]>('/api/barberos/'),
  crear: (data: Omit<Barbero, 'id' | 'foto_url'>) => apiFetch<Barbero>('/api/barberos/', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id: number, data: Partial<Barbero>) => apiFetch<Barbero>(`/api/barberos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id: number) => apiFetch<void>(`/api/barberos/${id}`, { method: 'DELETE' }),
}

// HORARIOS
export interface Horario { id: number; dia: string; abierto: boolean; hora_inicio: string; hora_fin: string }
export const horarios = {
  listar: () => apiFetch<Horario[]>('/api/horarios/'),
  actualizar: (data: Horario[]) => apiFetch<Horario[]>('/api/horarios/', { method: 'PUT', body: JSON.stringify(data) }),
}

// INFORMES
export interface InformesStats {
  total_citas: number; completadas: number; ingresos_totales: number; tasa_completadas: number
  citas_por_estado: Record<string, number>
  ingresos_por_barbero: Array<{ barbero: string; ingresos: number }>
}
export const informes = {
  stats: (periodo = '30d', fechaInicio?: string, fechaFin?: string) => {
    const q = new URLSearchParams({ periodo })
    if (fechaInicio) q.set('fecha_inicio', fechaInicio)
    if (fechaFin) q.set('fecha_fin', fechaFin)
    return apiFetch<InformesStats>(`/api/informes/?${q}`)
  },
}

// LEALTAD
export interface Cliente { id: number; nombre: string; telefono?: string; email?: string; sellos: number; sellos_totales: number; recompensas_canjeadas: number; creado_en: string }
export const lealtad = {
  clientes: (q?: string) => apiFetch<Cliente[]>(`/api/lealtad/clientes${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  darSello: (telefono: string) => apiFetch<{ cliente: string; sellos_actuales: number; recompensa_ganada: boolean; recompensa?: string }>('/api/lealtad/sello', { method: 'POST', body: JSON.stringify({ telefono }) }),
  resumen: () => apiFetch<{ total_clientes: number; sellos_dados_hoy: number; recompensas_canjeadas_total: number }>('/api/lealtad/resumen'),
}

// CONVERSACIONES
export interface Conversacion { id: number; telefono: string; nombre_contacto?: string; ultimo_mensaje?: string; ultimo_mensaje_en?: string; no_leidos: number; manejada_por_luna: boolean }
export interface Mensaje { id: number; contenido: string; enviado_por: 'cliente' | 'luna' | 'barberia'; enviado_en: string; leido: boolean }
export const conversaciones = {
  listar: (q?: string) => apiFetch<Conversacion[]>(`/api/conversaciones/${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  mensajes: (id: number) => apiFetch<Mensaje[]>(`/api/conversaciones/${id}/mensajes`),
  responder: (id: number, contenido: string) => apiFetch<{ ok: boolean }>(`/api/conversaciones/${id}/responder`, { method: 'POST', body: JSON.stringify({ contenido }) }),
}

// LUNA IA
export interface LunaIndicacion { id: number; texto: string; activa: boolean; creado_en: string }
export const luna = {
  stats: () => apiFetch<{ mensajes_respondidos: number; citas_creadas_por_luna: number; tasa_respuesta: number }>('/api/luna/stats'),
  indicaciones: () => apiFetch<LunaIndicacion[]>('/api/luna/indicaciones'),
  agregarIndicacion: (texto: string) => apiFetch<LunaIndicacion>('/api/luna/indicaciones', { method: 'POST', body: JSON.stringify({ texto }) }),
  toggleIndicacion: (id: number, activa: boolean) => apiFetch<LunaIndicacion>(`/api/luna/indicaciones/${id}`, { method: 'PUT', body: JSON.stringify({ activa }) }),
  eliminarIndicacion: (id: number) => apiFetch<void>(`/api/luna/indicaciones/${id}`, { method: 'DELETE' }),
}

// HELPERS
export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor)
}
