# TechStore - E-commerce Moderno

E-commerce completo construido con React, TypeScript, y Tailwind CSS, integrado con API REST backend.

## 🚀 Características

### Usuario
- ✅ Catálogo de productos con filtros avanzados (búsqueda, categorías, precio, stock)
- ✅ Detalle de productos con imágenes y características
- ✅ Carrito de compras (soporta usuarios anónimos y autenticados)
- ✅ Autenticación completa (registro, login, recuperación de contraseña)
- ✅ Gestión de perfil de usuario
- ✅ Gestión de direcciones de envío
- ✅ Proceso de checkout
- ✅ Historial de pedidos

### Administrador
- Panel de administración (próximamente)
- Gestión de productos
- Gestión de órdenes
- Gestión de usuarios

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS + Sistema de Diseño Personalizado
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **API Integration**: REST API con refresh token automático

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
# Crea un archivo .env basado en .env.example
cp .env.example .env
```

Edita `.env` y configura la URL de tu backend:
```env
VITE_API_BASE_URL=http://localhost:8080
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 🔧 Configuración del Backend

La aplicación espera que tu backend esté corriendo y disponible en la URL configurada en `VITE_API_BASE_URL`.

### Endpoints Requeridos

El frontend consume los siguientes endpoints de tu API:

**Autenticación**
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/me` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar contraseña

**Productos**
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Detalle de producto

**Categorías**
- `GET /api/categories` - Listar categorías

**Carrito**
- `GET /api/cart` - Obtener carrito
- `POST /api/cart/items` - Agregar item
- `PATCH /api/cart/items/:id` - Actualizar cantidad
- `DELETE /api/cart/items/:id` - Eliminar item
- `DELETE /api/cart/items` - Vaciar carrito
- `POST /api/cart/merge` - Fusionar carrito anónimo

**Órdenes**
- `POST /api/orders` - Crear orden
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/:id` - Detalle de orden

**Direcciones**
- `GET /api/addresses` - Listar direcciones
- `POST /api/addresses` - Crear dirección
- `PUT /api/addresses/:id` - Actualizar dirección
- `DELETE /api/addresses/:id` - Eliminar dirección

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño centralizado con tokens semánticos definidos en:
- `src/index.css` - Variables CSS y temas
- `tailwind.config.ts` - Configuración de Tailwind

### Colores Principales
- **Accent (Azul)**: CTAs y elementos interactivos
- **Success (Verde)**: Estados positivos y stock
- **Warning (Naranja)**: Alertas y urgencia
- **Primary (Negro)**: Texto y elementos principales

## 📱 Características Técnicas

### Autenticación
- Tokens JWT con refresh automático
- Persistencia de sesión en localStorage
- Redirección automática según estado de autenticación
- Merge automático de carrito al iniciar sesión

### Carrito
- Soporte para usuarios anónimos (vía sessionId en cookies)
- Sincronización automática con backend
- Actualización de cantidades en tiempo real
- Cálculo automático de subtotales

### Optimizaciones
- Lazy loading de imágenes
- Paginación en listados
- Skeleton loaders para mejor UX
- Manejo de errores centralizado
- Toast notifications para feedback

## 🚢 Deployment

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

Los archivos de producción se generarán en el directorio `dist/`

## 📝 Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes React
│   ├── layout/     # Header, Footer
│   ├── products/   # ProductCard, etc.
│   └── ui/         # Componentes shadcn/ui
├── contexts/        # React Contexts (Auth, Cart)
├── hooks/          # Custom hooks
├── lib/            # Utilidades y configuración
│   ├── api.ts     # Cliente API con refresh token
│   ├── types.ts   # TypeScript types
│   └── utils.ts   # Funciones helper
├── pages/          # Páginas de la aplicación
└── main.tsx        # Entry point
```

## 🔐 Seguridad

- Tokens JWT con expiración
- Refresh token automático
- Validación de formularios
- Sanitización de inputs
- HTTPS recomendado en producción

## 📄 Licencia

Este proyecto está bajo tu propiedad. Modifícalo como necesites.

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para problemas o preguntas, abre un issue en el repositorio.
