/**
 * Sistema de gestión de biblioteca
 * Este módulo contiene funciones para gestionar libros, préstamos y usuarios
 */

// Base de datos simulada
const baseDeDatos = {
  libros: [],
  usuarios: [],
  prestamos: []
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generarId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Agrega un nuevo libro a la biblioteca
 * @param {string} titulo - Título del libro
 * @param {string} autor - Autor del libro
 * @param {string} genero - Género del libro
 * @param {number} anioPublicacion - Año de publicación
 * @returns {object} El libro agregado
 */
function agregarLibro(titulo, autor, genero, anioPublicacion) {
  // Validaciones
  if (!titulo || typeof titulo !== 'string') {
    throw new Error('El título es obligatorio y debe ser una cadena de texto');
  }
  if (!autor || typeof autor !== 'string') {
    throw new Error('El autor es obligatorio y debe ser una cadena de texto');
  }
  if (genero && typeof genero !== 'string') {
    throw new Error('El género debe ser una cadena de texto');
  }
  if (anioPublicacion && (typeof anioPublicacion !== 'number' || anioPublicacion < 0)) {
    throw new Error('El año de publicación debe ser un número positivo');
  }

  // Crear libro
  const libro = {
    id: generarId(),
    titulo,
    autor,
    genero: genero || 'No especificado',
    anioPublicacion: anioPublicacion || null,
    disponible: true
  };

  // Agregar a la base de datos
  baseDeDatos.libros.push(libro);
  return libro;
}

/**
 * Busca libros por título, autor o género
 * @param {string} termino - Término de búsqueda
 * @param {string} campo - Campo por el cual buscar (titulo, autor, genero)
 * @returns {array} Lista de libros que coinciden con la búsqueda
 */
function buscarLibros(termino, campo = 'titulo') {
  // Validaciones
  if (!termino || typeof termino !== 'string') {
    throw new Error('El término de búsqueda es obligatorio y debe ser una cadena de texto');
  }
  
  const camposValidos = ['titulo', 'autor', 'genero'];
  if (!camposValidos.includes(campo)) {
    throw new Error('El campo de búsqueda debe ser titulo, autor o genero');
  }

  // Búsqueda
  const terminoLower = termino.toLowerCase();
  return baseDeDatos.libros.filter(libro => 
    libro[campo].toLowerCase().includes(terminoLower)
  );
}

/**
 * Registra un nuevo usuario en la biblioteca
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @returns {object} El usuario registrado
 */
function registrarUsuario(nombre, email) {
  // Validaciones
  if (!nombre || typeof nombre !== 'string') {
    throw new Error('El nombre es obligatorio y debe ser una cadena de texto');
  }
  if (!email || typeof email !== 'string') {
    throw new Error('El email es obligatorio y debe ser una cadena de texto');
  }
  if (!email.includes('@')) {
    throw new Error('El email debe ser válido');
  }

  // Verificar si el email ya está registrado
  const usuarioExistente = baseDeDatos.usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  // Crear usuario
  const usuario = {
    id: generarId(),
    nombre,
    email,
    fechaRegistro: new Date(),
    activo: true
  };

  // Agregar a la base de datos
  baseDeDatos.usuarios.push(usuario);
  return usuario;
}

/**
 * Realiza el préstamo de un libro a un usuario
 * @param {string} libroId - ID del libro
 * @param {string} usuarioId - ID del usuario
 * @param {number} diasPrestamo - Días de préstamo (por defecto 14)
 * @returns {object} El préstamo realizado
 */
function prestarLibro(libroId, usuarioId, diasPrestamo = 14) {
  // Validaciones
  if (!libroId || typeof libroId !== 'string') {
    throw new Error('El ID del libro es obligatorio y debe ser una cadena de texto');
  }
  if (!usuarioId || typeof usuarioId !== 'string') {
    throw new Error('El ID del usuario es obligatorio y debe ser una cadena de texto');
  }
  if (typeof diasPrestamo !== 'number' || diasPrestamo <= 0) {
    throw new Error('Los días de préstamo deben ser un número positivo');
  }

  // Buscar libro
  const libro = baseDeDatos.libros.find(l => l.id === libroId);
  if (!libro) {
    throw new Error('El libro no existe');
  }
  if (!libro.disponible) {
    throw new Error('El libro no está disponible');
  }

  // Buscar usuario
  const usuario = baseDeDatos.usuarios.find(u => u.id === usuarioId);
  if (!usuario) {
    throw new Error('El usuario no existe');
  }
  if (!usuario.activo) {
    throw new Error('El usuario no está activo');
  }

  // Calcular fechas
  const fechaPrestamo = new Date();
  const fechaDevolucion = new Date();
  fechaDevolucion.setDate(fechaDevolucion.getDate() + diasPrestamo);

  // Crear préstamo
  const prestamo = {
    id: generarId(),
    libroId,
    usuarioId,
    fechaPrestamo,
    fechaDevolucion,
    devuelto: false
  };

  // Actualizar disponibilidad del libro
  libro.disponible = false;

  // Agregar a la base de datos
  baseDeDatos.prestamos.push(prestamo);
  return prestamo;
}

/**
 * Devuelve un libro prestado
 * @param {string} prestamoId - ID del préstamo
 * @returns {object} El préstamo actualizado
 */
function devolverLibro(prestamoId) {
  // Validaciones
  if (!prestamoId || typeof prestamoId !== 'string') {
    throw new Error('El ID del préstamo es obligatorio y debe ser una cadena de texto');
  }

  // Buscar préstamo
  const prestamo = baseDeDatos.prestamos.find(p => p.id === prestamoId);
  if (!prestamo) {
    throw new Error('El préstamo no existe');
  }
  if (prestamo.devuelto) {
    throw new Error('El libro ya fue devuelto');
  }

  // Buscar libro
  const libro = baseDeDatos.libros.find(l => l.id === prestamo.libroId);
  if (!libro) {
    throw new Error('El libro asociado al préstamo no existe');
  }

  // Actualizar préstamo y libro
  prestamo.devuelto = true;
  prestamo.fechaDevolucionReal = new Date();
  libro.disponible = true;

  return prestamo;
}

/**
 * Obtiene los libros prestados a un usuario
 * @param {string} usuarioId - ID del usuario
 * @returns {array} Lista de préstamos del usuario
 */
function obtenerPrestamosUsuario(usuarioId) {
  // Validaciones
  if (!usuarioId || typeof usuarioId !== 'string') {
    throw new Error('El ID del usuario es obligatorio y debe ser una cadena de texto');
  }

  // Buscar usuario
  const usuario = baseDeDatos.usuarios.find(u => u.id === usuarioId);
  if (!usuario) {
    throw new Error('El usuario no existe');
  }

  // Obtener préstamos
  return baseDeDatos.prestamos.filter(p => p.usuarioId === usuarioId);
}

/**
 * Limpia la base de datos (solo para pruebas)
 */
function limpiarBaseDeDatos() {
  baseDeDatos.libros = [];
  baseDeDatos.usuarios = [];
  baseDeDatos.prestamos = [];
}

// Exportar funciones
module.exports = {
  agregarLibro,
  buscarLibros,
  registrarUsuario,
  prestarLibro,
  devolverLibro,
  obtenerPrestamosUsuario,
  limpiarBaseDeDatos,
  // Exportar base de datos para pruebas
  obtenerBaseDeDatos: () => baseDeDatos
};
