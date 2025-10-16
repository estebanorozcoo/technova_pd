# 🚀 TechNova - Product Management System

Complete web system for managing a technology product inventory with user authentication and role control (Admin/User).

---

## 📋 General Description

**TechNova** is a web application built with **Next.js**, **TypeScript**, and **MongoDB** that allows:

* ✅ User registration and login
* ✅ Full product management (CRUD)
* ✅ Role-based access control (Admin and User)
* ✅ Product filtering and search system
* ✅ Modern and responsive UI with Tailwind CSS

**System Roles:**

* **Admin:** Can create, edit, delete, and view products
* **User:** Can only view products

---

## 🛠️ Technologies Used

* **Frontend/Backend:** Next.js 15 with TypeScript
* **Database:** MongoDB with Mongoose
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **API Routes:** Next.js API Routes

---

## 📦 Prerequisites

Before starting, make sure you have installed:

* **Node.js** v18 or higher ([Download here](https://nodejs.org/))
* **npm** or **yarn** (included with Node.js)
* **MongoDB** (local or remote, e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
* **Git** to clone the repository

---

## ⚙️ Setup and Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/estebanorozcoo/technova_pd.git
cd technova_pd
```

### 2️⃣ Install Dependencies

```bash
npm install
# or if you use yarn
yarn install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/technova?retryWrites=true&w=majority
```

**Note:** Replace `user`, `password`, and `cluster` with your real MongoDB credentials.

**Example for local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/technova
```

### 4️⃣ Run in Development Mode

```bash
npm run dev
# or
yarn dev
```

The app will be available at: **[http://localhost:3000](http://localhost:3000)**

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
technova_pd/
├── src/
│   ├── lib/
│   │   └── db.ts                 # MongoDB connection
│   ├── models/
│   │   ├── product.ts            # Product schema
│   │   └── user.ts               # User schema
│   ├── pages/
│   │   ├── api/
│   │   │   ├── login.ts          # Authentication endpoint
│   │   │   ├── register.ts       # Registration endpoint
│   │   │   └── products.ts       # Product CRUD endpoints
│   │   ├── dashboard.tsx         # Main dashboard
│   │   ├── index.tsx             # Login page
│   │   └── register.tsx          # Registration page
│   ├── services/
│   │   └── productsServices.ts   # HTTP services
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── styles/
│       └── globals.css           # Global styles
├── .env.local                     # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Main Features

### 🔐 Authentication

* **User registration** with name, email, password, and role
* **Login** with credential validation
* **Session persistence** using localStorage
* **Route protection** based on role

### 📦 Product Management

Each product contains the following data:

```typescript
{
  name: string;        // Product name
  brand: string;       // Brand
  quantity: number;    // Inventory quantity
  price: number;       // Price
  isActive: boolean;   // Active/inactive status
  category: string;    // Category
  img: string;         // Image URL
  sku: string;         // Unique product code
}
```

**Available operations:**

* ✅ **Create** new products (Admin only)
* 📝 **Edit** existing products (Admin only)
* 🗑️ **Delete** products (Admin only)
* 🔍 **Search** products by name, category, or SKU
* 👁️ **View** all products

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/api/register` | Register new user |
| POST   | `/api/login`    | Login user        |

### Products

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/api/products` | Get all products      |
| POST   | `/api/products` | Create a new product  |
| PUT    | `/api/products` | Update product by SKU |
| DELETE | `/api/products` | Delete product by SKU |

---

## 👤 Test Users

You can create new users from the registration page or use these examples:

**Administrator:**

```json
{
  "name": "Admin User",
  "email": "admin@technova.com",
  "password": "admin123",
  "role": "admin"
}
```

**Regular User:**

```json
{
  "name": "John Doe",
  "email": "user@technova.com",
  "password": "user123",
  "role": "user"
}
```

---

## 🎨 Screenshots

### Login

Main page where users log in.

### Dashboard

Main view showing the product list and management forms (visible depending on the user’s role).

### Register

Form for creating new user accounts.

---

## 🔧 Available Scripts

```bash
npm run dev        # Run in development mode
npm run build      # Build for production
npm start          # Run production build
npm run lint       # Run linter
```

---

## 🚨 Common Issues and Fixes

### Error: "MONGODB_URI is not defined"

* Ensure that the `.env.local` file exists in the project root
* Make sure the `MONGODB_URI` variable is properly defined

### MongoDB Connection Error

* Verify your MongoDB credentials
* If using MongoDB Atlas, ensure your IP is whitelisted
* Check that your connection string is correct

### Products Not Updating

* Ensure the `sku` field is included in the request body
* Verify that the product exists in the database

---

## 📞 Developer Contact

**Name:** Esteban Orozco Osorio
**Clan:** Gosling
**Email:** [estebanorozcoosorio@gmail.com](mailto:estebanorozcoosorio@gmail.com)
**GitHub:** [github.com/estebanorozcoo](https://github.com/estebanorozcoo)
**Repository:** [technova_pd](https://github.com/estebanorozcoo/technova_pd)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

Developed as part of the Full Stack Web Development training program.

**TechNova** - Inventory Management System © 2025

---

## 📝 Additional Notes

* Passwords are currently stored in plain text. For production, use **bcrypt** for encryption
* Consider implementing **JWT** for more secure session management
* The project is set up for development. For production, adjust environment variables and security configurations

---

**Thanks for using TechNova! 🚀**

---









# 🚀 TechNova - Sistema de Gestión de Productos

Sistema web completo para la gestión de inventario de productos tecnológicos con autenticación de usuarios y roles (Admin/User).

---

## 📋 Descripción General

**TechNova** es una aplicación web desarrollada con **Next.js**, **TypeScript** y **MongoDB** que permite:

- ✅ Registro e inicio de sesión de usuarios
- ✅ Gestión completa de productos (CRUD)
- ✅ Control de roles (Administrador y Usuario)
- ✅ Sistema de filtrado y búsqueda de productos
- ✅ Interfaz moderna y responsiva con Tailwind CSS

**Roles del sistema:**
- **Admin**: Puede crear, editar, eliminar y visualizar productos
- **User**: Solo puede visualizar productos

---

## 🛠️ Tecnologías Utilizadas

- **Frontend/Backend**: Next.js 15 con TypeScript
- **Base de Datos**: MongoDB con Mongoose
- **Estilos**: Tailwind CSS
- **HTTP Client**: Axios
- **Rutas API**: Next.js API Routes

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** o **yarn** (incluido con Node.js)
- **MongoDB** (local o remoto, por ejemplo [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** para clonar el repositorio

---

## ⚙️ Configuración e Instalación

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/estebanorozcoo/technova_pd.git
cd technova_pd
```

### 2️⃣ Instalar Dependencias

```bash
npm install
# o si usas yarn
yarn install
```

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con la siguiente configuración:

```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/technova?retryWrites=true&w=majority
```

**Nota:** Reemplaza `usuario`, `contraseña` y `cluster` con tus credenciales reales de MongoDB.

**Ejemplo con MongoDB local:**
```env
MONGODB_URI=mongodb://localhost:27017/technova
```

### 4️⃣ Ejecutar en Modo Desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en: **http://localhost:3000**

### 5️⃣ Construir para Producción

```bash
npm run build
npm start
```

---

## 📂 Estructura del Proyecto

```
technova_pd/
├── src/
│   ├── lib/
│   │   └── db.ts                 # Conexión a MongoDB
│   ├── models/
│   │   ├── product.ts            # Schema de productos
│   │   └── user.ts               # Schema de usuarios
│   ├── pages/
│   │   ├── api/
│   │   │   ├── login.ts          # Endpoint de autenticación
│   │   │   ├── register.ts       # Endpoint de registro
│   │   │   └── products.ts       # CRUD de productos
│   │   ├── dashboard.tsx         # Dashboard principal
│   │   ├── index.tsx             # Página de login
│   │   └── register.tsx          # Página de registro
│   ├── services/
│   │   └── productsServices.ts   # Servicios HTTP
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript
│   └── styles/
│       └── globals.css           # Estilos globales
├── .env.local                     # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Funcionalidades Principales

### 🔐 Autenticación

- **Registro de usuarios** con nombre, email, contraseña y rol
- **Login** con validación de credenciales
- **Persistencia de sesión** mediante localStorage
- **Protección de rutas** por rol

### 📦 Gestión de Productos

Los productos contienen la siguiente información:

```typescript
{
  name: string;        // Nombre del producto
  brand: string;       // Marca
  quantity: number;    // Cantidad en inventario
  price: number;       // Precio
  isActive: boolean;   // Estado activo/inactivo
  category: string;    // Categoría
  img: string;         // URL de la imagen
  sku: string;         // Código único del producto
}
```

**Operaciones disponibles:**
- ✅ **Crear** nuevos productos (Solo Admin)
- 📝 **Editar** productos existentes (Solo Admin)
- 🗑️ **Eliminar** productos (Solo Admin)
- 🔍 **Buscar** productos por nombre, categoría o SKU
- 👁️ **Visualizar** todos los productos

---

## 🌐 Endpoints API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/register` | Registrar nuevo usuario |
| POST | `/api/login` | Iniciar sesión |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products` | Actualizar producto por SKU |
| DELETE | `/api/products` | Eliminar producto por SKU |

---

## 👤 Usuarios de Prueba

Puedes crear usuarios desde la página de registro o usar estos ejemplos:

**Administrador:**
```json
{
  "name": "Admin User",
  "email": "admin@technova.com",
  "password": "admin123",
  "role": "admin"
}
```

**Usuario Regular:**
```json
{
  "name": "John Doe",
  "email": "user@technova.com",
  "password": "user123",
  "role": "user"
}
```

---

## 🎨 Capturas de Pantalla

### Login
Página principal donde los usuarios inician sesión.

### Dashboard
Vista principal con listado de productos y formularios de gestión (visible según rol).

### Registro
Formulario para crear nuevas cuentas de usuario.

---

## 🔧 Scripts Disponibles

```bash
npm run dev        # Ejecutar en modo desarrollo
npm run build      # Construir para producción
npm start          # Ejecutar versión de producción
npm run lint       # Ejecutar linter
```

---

## 🚨 Solución de Problemas Comunes

### Error: "MONGODB_URI no está definida"
- Verifica que el archivo `.env.local` existe en la raíz del proyecto
- Asegúrate de que la variable `MONGODB_URI` está correctamente definida

### Error de conexión a MongoDB
- Verifica tus credenciales de MongoDB
- Si usas MongoDB Atlas, asegúrate de que tu IP está en la whitelist
- Comprueba que el string de conexión es correcto

### Productos no se actualizan
- Verifica que estás enviando el campo `sku` en el body del request
- Asegúrate de que el producto existe en la base de datos

---

## 📞 Contacto del Desarrollador

**Nombre:** Esteban Orozco Osorio  
**Clan:** Gosling  
**Correo:** estebanorozcoosorio@gmail.com  
**GitHub:** [github.com/estebanorozcoo](https://github.com/estebanorozcoo)  
**Repositorio:** [technova_pd](https://github.com/estebanorozcoo/technova_pd)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🙏 Agradecimientos

Desarrollado como parte del programa de formación en desarrollo web Full Stack.

**TechNova** - Sistema de Gestión de Inventario © 2025

---

## 📝 Notas Adicionales

- Las contraseñas actualmente se almacenan en texto plano. Para producción, se recomienda usar **bcrypt** para encriptación
- Se recomienda implementar **JWT** para manejo de sesiones más seguro
- El proyecto está configurado para desarrollo. Para producción, ajusta las variables de entorno y configuraciones de seguridad

---

**¡Gracias por usar TechNova! 🚀**














































This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
