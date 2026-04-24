# BarberPole - Página de Login

## Funcionalidades implementadas

### 🔐 Sistema de Autenticación
- **Página de Login**: Formulario completo con validación
- **Contexto de Autenticación**: Gestión global del estado de usuario
- **Protección de Rutas**: Dashboard protegido para usuarios autenticados
- **Logout**: Funcionalidad de cerrar sesión desde el Topbar

### 📝 Página de Login
- Diseño responsivo con el tema de la aplicación
- Campos de email y contraseña
- Validación de formulario
- Manejo de errores de autenticación
- Estados de carga durante el login
- Redirección automática al dashboard tras login exitoso

### 🛡️ Protección de Rutas
- Rutas del dashboard protegidas con `ProtectedRoute`
- Redirección automática a login si no está autenticado
- Pantallas de carga durante la verificación de autenticación

### 🔗 API Integration
- Integración con el endpoint `/api/auth/login`
- Manejo automático de tokens JWT
- Almacenamiento seguro en localStorage
- Verificación automática de token al cargar la app

## Archivos creados/modificados

### Nuevos archivos:
- `src/context/AuthContext.tsx` - Contexto de autenticación
- `src/pages/LoginPage.tsx` - Página de login
- `src/routes/ProtectedRoute.tsx` - Componente de ruta protegida

### Archivos modificados:
- `src/routes/paths.ts` - Agregada ruta de login
- `src/routes/AppRoutes.tsx` - Rutas protegidas y página de login
- `src/main.tsx` - AuthProvider envuelto en la app
- `src/layouts/Topbar.tsx` - Integración con logout

## Uso

### Acceder a la página de login:
```
http://localhost:5173/login
```

### API Endpoint esperado:
```typescript
POST /api/auth/login
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

Respuesta esperada:
```json
{
  "access_token": "jwt_token_here",
  "usuario_nombre": "Nombre Usuario",
  "negocio_nombre": "Nombre Negocio",
  "negocio_slug": "slug-negocio"
}
```

## Estados de autenticación

- **No autenticado**: Redirige a `/login`
- **Autenticado**: Acceso completo al dashboard
- **Verificando**: Pantalla de carga durante la validación del token

## Seguridad

- Tokens almacenados en localStorage
- Limpieza automática de tokens expirados/inválidos
- Redirección automática al login en caso de 401
- Protección de rutas sensibles