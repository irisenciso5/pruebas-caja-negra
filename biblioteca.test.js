/**
 * Pruebas unitarias de caja negra para el sistema de biblioteca
 * Estas pruebas están diseñadas para verificar el comportamiento externo
 * de las funciones, sin considerar su estructura interna
 */

const {
  agregarLibro,
  buscarLibros,
  registrarUsuario,
  prestarLibro,
  devolverLibro,
  obtenerPrestamosUsuario,
  limpiarBaseDeDatos,
  obtenerBaseDeDatos
} = require('./biblioteca');

// Antes de cada prueba, limpiar la base de datos
beforeEach(() => {
  limpiarBaseDeDatos();
});

/**
 * PRUEBA 1: Prueba de particiones de equivalencia para agregarLibro
 * Tipo de prueba: Particiones de equivalencia
 * Objetivo: Verificar que la función maneja correctamente diferentes tipos de entradas
 */
describe('Pruebas de caja negra para la función agregarLibro', () => {
  test('Debe agregar un libro con todos los datos correctos', () => {
    const libro = agregarLibro('Don Quijote', 'Miguel de Cervantes', 'Novela', 1605);
    
    expect(libro).toHaveProperty('id');
    expect(libro.titulo).toBe('Don Quijote');
    expect(libro.autor).toBe('Miguel de Cervantes');
    expect(libro.genero).toBe('Novela');
    expect(libro.anioPublicacion).toBe(1605);
    expect(libro.disponible).toBe(true);
    
    // Verificar que se agregó a la base de datos
    const bd = obtenerBaseDeDatos();
    expect(bd.libros).toContainEqual(libro);
  });

  test('Debe agregar un libro con solo los datos obligatorios', () => {
    const libro = agregarLibro('La Odisea', 'Homero');
    
    expect(libro).toHaveProperty('id');
    expect(libro.titulo).toBe('La Odisea');
    expect(libro.autor).toBe('Homero');
    expect(libro.genero).toBe('No especificado');
    expect(libro.anioPublicacion).toBeNull();
    expect(libro.disponible).toBe(true);
  });

  test('Debe rechazar un libro sin título', () => {
    expect(() => agregarLibro(null, 'Gabriel García Márquez')).toThrow('El título es obligatorio');
    expect(() => agregarLibro('', 'Gabriel García Márquez')).toThrow('El título es obligatorio');
  });

  test('Debe rechazar un libro sin autor', () => {
    expect(() => agregarLibro('Cien años de soledad', null)).toThrow('El autor es obligatorio');
    expect(() => agregarLibro('Cien años de soledad', '')).toThrow('El autor es obligatorio');
  });

  test('Debe rechazar un año de publicación inválido', () => {
    expect(() => agregarLibro('El Principito', 'Antoine de Saint-Exupéry', 'Fábula', -1943)).toThrow('El año de publicación debe ser un número positivo');
    expect(() => agregarLibro('El Principito', 'Antoine de Saint-Exupéry', 'Fábula', '1943')).toThrow('El año de publicación debe ser un número');
  });
});

/**
 * PRUEBA 2: Prueba de casos de uso para buscarLibros
 * Tipo de prueba: Casos de uso típicos y atípicos
 * Objetivo: Verificar el comportamiento con diferentes casos de búsqueda
 */
describe('Pruebas de caja negra para la función buscarLibros', () => {
  beforeEach(() => {
    // Agregar algunos libros para las pruebas
    agregarLibro('Cien años de soledad', 'Gabriel García Márquez', 'Realismo mágico', 1967);
    agregarLibro('El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Novela romántica', 1985);
    agregarLibro('La ciudad y los perros', 'Mario Vargas Llosa', 'Novela', 1963);
    agregarLibro('Rayuela', 'Julio Cortázar', 'Novela experimental', 1963);
  });

  test('Debe encontrar libros por título', () => {
    const resultados = buscarLibros('cien años', 'titulo');
    expect(resultados).toHaveLength(1);
    expect(resultados[0].titulo).toBe('Cien años de soledad');
  });

  test('Debe encontrar libros por autor', () => {
    const resultados = buscarLibros('garcía márquez', 'autor');
    expect(resultados).toHaveLength(2);
    expect(resultados[0].autor).toBe('Gabriel García Márquez');
    expect(resultados[1].autor).toBe('Gabriel García Márquez');
  });

  test('Debe encontrar libros por género', () => {
    const resultados = buscarLibros('novela', 'genero');
    expect(resultados).toHaveLength(3); // Novela, Novela romántica, Novela experimental
  });

  test('Debe devolver un array vacío si no hay coincidencias', () => {
    const resultados = buscarLibros('Harry Potter', 'titulo');
    expect(resultados).toHaveLength(0);
  });

  test('Debe ser insensible a mayúsculas/minúsculas', () => {
    const resultados = buscarLibros('GARCÍA', 'autor');
    expect(resultados).toHaveLength(2);
  });

  test('Debe rechazar un término de búsqueda vacío', () => {
    expect(() => buscarLibros('', 'titulo')).toThrow('El término de búsqueda es obligatorio');
    expect(() => buscarLibros(null, 'titulo')).toThrow('El término de búsqueda es obligatorio');
  });

  test('Debe rechazar un campo de búsqueda inválido', () => {
    expect(() => buscarLibros('García', 'precio')).toThrow('El campo de búsqueda debe ser titulo, autor o genero');
  });
});

/**
 * PRUEBA 3: Prueba de valores límite para registrarUsuario
 * Tipo de prueba: Análisis de valores límite
 * Objetivo: Verificar el comportamiento con valores extremos o límite
 */
describe('Pruebas de caja negra para la función registrarUsuario', () => {
  test('Debe registrar un usuario con datos válidos', () => {
    const usuario = registrarUsuario('Ana López', 'ana.lopez@ejemplo.com');
    
    expect(usuario).toHaveProperty('id');
    expect(usuario.nombre).toBe('Ana López');
    expect(usuario.email).toBe('ana.lopez@ejemplo.com');
    expect(usuario).toHaveProperty('fechaRegistro');
    expect(usuario.activo).toBe(true);
    
    // Verificar que se agregó a la base de datos
    const bd = obtenerBaseDeDatos();
    expect(bd.usuarios).toContainEqual(usuario);
  });

  test('Debe rechazar un nombre vacío', () => {
    expect(() => registrarUsuario('', 'ana@ejemplo.com')).toThrow('El nombre es obligatorio');
    expect(() => registrarUsuario(null, 'ana@ejemplo.com')).toThrow('El nombre es obligatorio');
  });

  test('Debe rechazar un email vacío', () => {
    expect(() => registrarUsuario('Ana López', '')).toThrow('El email es obligatorio');
    expect(() => registrarUsuario('Ana López', null)).toThrow('El email es obligatorio');
  });

  test('Debe rechazar un email inválido', () => {
    expect(() => registrarUsuario('Ana López', 'ana.lopez')).toThrow('El email debe ser válido');
    expect(() => registrarUsuario('Ana López', 'ana.lopez.ejemplo.com')).toThrow('El email debe ser válido');
  });

  test('Debe rechazar un email ya registrado', () => {
    registrarUsuario('Ana López', 'ana@ejemplo.com');
    expect(() => registrarUsuario('Pedro Pérez', 'ana@ejemplo.com')).toThrow('El email ya está registrado');
  });
});

/**
 * PRUEBA 4: Prueba de tabla de decisión para prestarLibro
 * Tipo de prueba: Tabla de decisión
 * Objetivo: Verificar todas las combinaciones de decisiones posibles
 */
describe('Pruebas de caja negra para la función prestarLibro', () => {
  let libroId, usuarioId;

  beforeEach(() => {
    // Preparar datos para las pruebas
    const libro = agregarLibro('El Señor de los Anillos', 'J.R.R. Tolkien', 'Fantasía', 1954);
    const usuario = registrarUsuario('Carlos Gómez', 'carlos@ejemplo.com');
    libroId = libro.id;
    usuarioId = usuario.id;
  });

  test('Debe prestar un libro correctamente', () => {
    const prestamo = prestarLibro(libroId, usuarioId, 14);
    
    expect(prestamo).toHaveProperty('id');
    expect(prestamo.libroId).toBe(libroId);
    expect(prestamo.usuarioId).toBe(usuarioId);
    expect(prestamo).toHaveProperty('fechaPrestamo');
    expect(prestamo).toHaveProperty('fechaDevolucion');
    expect(prestamo.devuelto).toBe(false);
    
    // Verificar que se agregó a la base de datos
    const bd = obtenerBaseDeDatos();
    expect(bd.prestamos).toContainEqual(prestamo);
    
    // Verificar que el libro ya no está disponible
    const libro = bd.libros.find(l => l.id === libroId);
    expect(libro.disponible).toBe(false);
  });

  test('Debe usar el valor por defecto para días de préstamo', () => {
    const prestamo = prestarLibro(libroId, usuarioId);
    
    const fechaPrestamo = new Date(prestamo.fechaPrestamo);
    const fechaDevolucion = new Date(prestamo.fechaDevolucion);
    const diasDiferencia = Math.round((fechaDevolucion - fechaPrestamo) / (1000 * 60 * 60 * 24));
    
    expect(diasDiferencia).toBe(14); // 14 días por defecto
  });

  test('Debe rechazar un ID de libro inválido', () => {
    expect(() => prestarLibro('', usuarioId)).toThrow('El ID del libro es obligatorio');
    expect(() => prestarLibro(null, usuarioId)).toThrow('El ID del libro es obligatorio');
    expect(() => prestarLibro('id_inexistente', usuarioId)).toThrow('El libro no existe');
  });

  test('Debe rechazar un ID de usuario inválido', () => {
    expect(() => prestarLibro(libroId, '')).toThrow('El ID del usuario es obligatorio');
    expect(() => prestarLibro(libroId, null)).toThrow('El ID del usuario es obligatorio');
    expect(() => prestarLibro(libroId, 'id_inexistente')).toThrow('El usuario no existe');
  });

  test('Debe rechazar días de préstamo inválidos', () => {
    expect(() => prestarLibro(libroId, usuarioId, 0)).toThrow('Los días de préstamo deben ser un número positivo');
    expect(() => prestarLibro(libroId, usuarioId, -7)).toThrow('Los días de préstamo deben ser un número positivo');
    expect(() => prestarLibro(libroId, usuarioId, '14')).toThrow('Los días de préstamo deben ser un número');
  });

  test('Debe rechazar prestar un libro no disponible', () => {
    prestarLibro(libroId, usuarioId); // Primer préstamo
    expect(() => prestarLibro(libroId, usuarioId)).toThrow('El libro no está disponible');
  });
});

/**
 * PRUEBA 5: Prueba de flujo de transacciones para devolverLibro
 * Tipo de prueba: Flujo de transacciones
 * Objetivo: Verificar el comportamiento en un flujo completo de préstamo y devolución
 */
describe('Pruebas de caja negra para la función devolverLibro', () => {
  let prestamoId, libroId;

  beforeEach(() => {
    // Preparar datos para las pruebas
    const libro = agregarLibro('Harry Potter', 'J.K. Rowling', 'Fantasía', 1997);
    const usuario = registrarUsuario('Laura Martínez', 'laura@ejemplo.com');
    libroId = libro.id;
    const prestamo = prestarLibro(libro.id, usuario.id, 7);
    prestamoId = prestamo.id;
  });

  test('Debe devolver un libro correctamente', () => {
    const prestamo = devolverLibro(prestamoId);
    
    expect(prestamo.devuelto).toBe(true);
    expect(prestamo).toHaveProperty('fechaDevolucionReal');
    
    // Verificar que el libro está disponible nuevamente
    const bd = obtenerBaseDeDatos();
    const libro = bd.libros.find(l => l.id === libroId);
    expect(libro.disponible).toBe(true);
  });

  test('Debe rechazar un ID de préstamo inválido', () => {
    expect(() => devolverLibro('')).toThrow('El ID del préstamo es obligatorio');
    expect(() => devolverLibro(null)).toThrow('El ID del préstamo es obligatorio');
    expect(() => devolverLibro('id_inexistente')).toThrow('El préstamo no existe');
  });

  test('Debe rechazar devolver un libro ya devuelto', () => {
    devolverLibro(prestamoId); // Primera devolución
    expect(() => devolverLibro(prestamoId)).toThrow('El libro ya fue devuelto');
  });
});

/**
 * PRUEBA 6: Prueba de casos de uso para obtenerPrestamosUsuario
 * Tipo de prueba: Casos de uso típicos y atípicos
 * Objetivo: Verificar el comportamiento con diferentes casos de uso
 */
describe('Pruebas de caja negra para la función obtenerPrestamosUsuario', () => {
  let usuarioId, libroId1, libroId2;

  beforeEach(() => {
    // Preparar datos para las pruebas
    const usuario = registrarUsuario('Roberto Sánchez', 'roberto@ejemplo.com');
    usuarioId = usuario.id;
    
    const libro1 = agregarLibro('1984', 'George Orwell', 'Distopía', 1949);
    const libro2 = agregarLibro('Un mundo feliz', 'Aldous Huxley', 'Distopía', 1932);
    libroId1 = libro1.id;
    libroId2 = libro2.id;
    
    // Crear otro usuario para verificar que no se mezclan los préstamos
    const otroUsuario = registrarUsuario('María Rodríguez', 'maria@ejemplo.com');
    const libro3 = agregarLibro('Fahrenheit 451', 'Ray Bradbury', 'Distopía', 1953);
    
    // Realizar préstamos
    prestarLibro(libroId1, usuarioId, 7);
    prestarLibro(libroId2, usuarioId, 14);
    prestarLibro(libro3.id, otroUsuario.id, 7);
  });

  test('Debe obtener todos los préstamos de un usuario', () => {
    const prestamos = obtenerPrestamosUsuario(usuarioId);
    
    expect(prestamos).toHaveLength(2);
    expect(prestamos[0].libroId).toBe(libroId1);
    expect(prestamos[1].libroId).toBe(libroId2);
    expect(prestamos[0].usuarioId).toBe(usuarioId);
    expect(prestamos[1].usuarioId).toBe(usuarioId);
  });

  test('Debe devolver un array vacío si el usuario no tiene préstamos', () => {
    // Crear un usuario sin préstamos
    const usuario = registrarUsuario('Usuario Sin Préstamos', 'sinprestamos@ejemplo.com');
    const prestamos = obtenerPrestamosUsuario(usuario.id);
    
    expect(prestamos).toHaveLength(0);
  });

  test('Debe rechazar un ID de usuario inválido', () => {
    expect(() => obtenerPrestamosUsuario('')).toThrow('El ID del usuario es obligatorio');
    expect(() => obtenerPrestamosUsuario(null)).toThrow('El ID del usuario es obligatorio');
    expect(() => obtenerPrestamosUsuario('id_inexistente')).toThrow('El usuario no existe');
  });

  test('Debe reflejar las devoluciones en los préstamos obtenidos', () => {
    // Devolver uno de los libros
    const prestamos = obtenerPrestamosUsuario(usuarioId);
    devolverLibro(prestamos[0].id);
    
    // Obtener los préstamos nuevamente
    const prestamosActualizados = obtenerPrestamosUsuario(usuarioId);
    
    expect(prestamosActualizados).toHaveLength(2);
    expect(prestamosActualizados[0].devuelto).toBe(true);
    expect(prestamosActualizados[1].devuelto).toBe(false);
  });
});
