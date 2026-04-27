# CrudLaravel — Full Stack App

Aplicación full-stack con **Laravel 11** (REST API) y **Next.js 14** (frontend), con gestión de usuarios, dashboard estadístico y autenticación JWT + Google OAuth.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Laravel 11, JWT Auth, Socialite |
| Frontend | Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion |
| Base de datos | MySQL con Stored Procedures |
| Almacenamiento | Supabase Storage (fotos de perfil) |
| Tests | PHPUnit (Feature Tests) |

---

## Estructura del proyecto

```
Entregable/
├── BD.sql          ← Script de base de datos (tablas + stored procedures)
├── backend/        ← API Laravel 11
└── frontend/       ← App Next.js 14
```

---

## Instalación desde cero

### 1. Base de datos

Abre MySQL (phpMyAdmin, HeidiSQL, etc.) e importa el archivo:

```
BD.sql
```

Esto creará la base de datos `Crud_Laravel` con todas las tablas y Stored Procedures.

---

### 2. Backend (Laravel)

```bash
cd backend

# Instalar dependencias PHP
composer install

# Crear archivo de entorno
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crud_laravel
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=          # se genera con el comando de abajo

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/api/auth/google/callback
```

```bash
# Generar clave de app
php artisan key:generate

# Generar secret JWT
php artisan jwt:secret

# Iniciar servidor
php artisan serve
```

El backend quedará corriendo en `http://localhost:8000`.

---

### 3. Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias Node
npm install

# Crear archivo de entorno
```

Crea el archivo `.env.local` en la raíz de `/frontend`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_<tu-clave>
```

> Las credenciales de Supabase las encuentras en tu proyecto en **supabase.com → Settings → API**.

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El frontend quedará corriendo en `http://localhost:3000`.

---

## Ejecutar tests del backend

```bash
cd backend

# Correr todos los tests
php artisan test

# Solo tests de autenticación
php artisan test --filter=AuthTest

# Solo tests de usuarios
php artisan test --filter=UserTest
```

Los tests usan `DatabaseTransactions`, por lo que **no modifican permanentemente** la base de datos.

---

## Endpoints principales

### Auth (públicos)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/registrar` | Registrar usuario |
| POST | `/api/olvide-password` | Solicitar token de recuperación |
| POST | `/api/actualizar-password` | Resetear contraseña |
| GET | `/api/auth/google` | Obtener URL de Google OAuth |

### Usuarios (requieren JWT)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/{id}` | Obtener un usuario |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |

### Dashboard (requieren JWT)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/stats` | Estadísticas (cards) |
| GET | `/api/dashboard/charts` | Datos para gráficos |

---

## Notas importantes

- El archivo `.env` del backend **nunca se sube a Git**.
- El archivo `.env.local` del frontend **nunca se sube a Git**.
- Las carpetas `vendor/` y `node_modules/` **nunca se suben a Git**.
- Para Google OAuth en desarrollo, puede ser necesario deshabilitar el **Web Shield de Avast** temporalmente si hay errores SSL.
