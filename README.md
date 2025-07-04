# Librería Online - Ecommerce

## Presentación
Librería Online es una aplicación web de comercio electrónico desarrollada como proyecto integrador para la cursada de Fullstack. Permite a los usuarios explorar un catálogo de libros, agregarlos a un carrito de compras y simular el proceso de compra. El objetivo es ofrecer una experiencia moderna, intuitiva y adaptable a distintos dispositivos.

## Características principales
- Catálogo de libros con imágenes, descripciones, precios y stock.
- Carrito de compras persistente en el navegador.
- Vistas dinámicas con Handlebars y Bootstrap.
- Manejo de errores y mensajes amigables para el usuario.

## Aspectos técnicos
- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB (Mongoose ODM)
- **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript, Handlebars (hbs)
- **Estructura:**
  - Rutas API para productos y carrito (`/api/productos`, `/api/carrito`)
  - Rutas de vistas para páginas principales (`/`, `/products`, `/cart`)
  - Controladores separados para lógica de negocio
  - Modelos Mongoose para productos y carritos
  - Vistas y parciales reutilizables con Handlebars
- **Imágenes de libros:**
  - Si el producto tiene ISBN, se utiliza la API de OpenLibrary para mostrar la portada.
  - Si no, se usa la imagen proporcionada o un placeholder.
- **Manejo de variables de entorno:**
  - Configuración de puerto y conexión a MongoDB mediante `.env`.
- **Estilos personalizados:**
  - Fondo con imagen y opacidad.
  - Navbar y footer fijos.
  - Tarjetas de productos con animaciones.

## Instalación y uso
1. Clonar el repositorio y ubicarse en la carpeta del proyecto.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo `.env` con los datos de conexión a MongoDB y el puerto.
4. Iniciar el servidor:
   ```bash
   npm start
   ```
5. Acceder a la app en [http://localhost:3000](http://localhost:3000)

## Operaciones CRUD vía Postman

### Productos
| Operación      | Método HTTP | Endpoint                  | Descripción                                 | Body (JSON) requerido         |
|----------------|-------------|---------------------------|---------------------------------------------|-------------------------------|
| Crear producto | POST        | /api/productos            | Crea un nuevo producto                      | Sí (name, description, price, stock, etc.) |
| Listar todos   | GET         | /api/productos            | Obtiene todos los productos                 | No                            |
| Obtener uno    | GET         | /api/productos/:id        | Obtiene un producto por su ID               | No                            |
| Actualizar     | PUT         | /api/productos/:id        | Actualiza un producto existente por su ID   | Sí (campos a modificar)       |
| Eliminar       | DELETE      | /api/productos/:id        | Elimina un producto por su ID               | No                            |

Ejemplo de body para POST/PUT:
```json
{
  "name": "Nombre del libro",
  "description": "Descripción",
  "price": 10.99,
  "stock": 5,
  "category": "Categoría",
  "imageUrl": "https://..."
}
```

### Carrito
| Operación                | Método HTTP | Endpoint                  | Descripción                                         | Body (JSON) requerido         |
|--------------------------|-------------|---------------------------|-----------------------------------------------------|-------------------------------|
| Crear carrito            | POST        | /api/carrito              | Crea un nuevo carrito vacío                         | No                            |
| Obtener carrito por ID   | GET         | /api/carrito/:id          | Obtiene el carrito por su ID                        | No                            |
| Agregar producto         | POST        | /api/carrito/:id/productos| Agrega un producto al carrito                       | Sí (productId, quantity)      |
| Eliminar producto        | DELETE      | /api/carrito/:id/productos/:prodId | Elimina un producto del carrito           | No                            |
| Vaciar carrito           | DELETE      | /api/carrito/:id          | Elimina todos los productos del carrito             | No                            |

Ejemplo de body para agregar producto al carrito:
```json
{
  "productId": "ID_DEL_PRODUCTO",
  "quantity": 2
}
```

## Notas
- El proyecto es de propósito educativo y puede ser extendido con autenticación, panel de administración, pagos, etc.
- Para cargar productos, se puede usar Postman o una herramienta similar con la API REST.

---
Desarrollado como desafío - Integrador II - Fullstack - Educación IT
