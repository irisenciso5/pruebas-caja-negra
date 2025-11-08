# Pruebas Unitarias de Caja Blanca y Caja Negra

Este proyecto contiene un módulo de calculadora simple y pruebas unitarias tanto de caja blanca como de caja negra para verificar su funcionamiento interno y externo.

## Estructura del Proyecto

- `calculadora.js`: Contiene las funciones básicas de la calculadora
- `calculadora.test.js`: Contiene las pruebas unitarias de caja blanca
- `calculadora.caja-negra.test.js`: Contiene las pruebas unitarias de caja negra
- `package.json`: Configuración del proyecto y dependencias
- `informe_auditoria.md`: Documento sobre los resultados y aportes de las pruebas de caja blanca
- `informe_caja_negra.md`: Documento explicativo sobre las pruebas de caja negra

## Funciones Implementadas

- `sumar(a, b)`: Suma dos números
- `restar(a, b)`: Resta dos números
- `multiplicar(a, b)`: Multiplica dos números
- `dividir(a, b)`: Divide dos números
- `factorial(n)`: Calcula el factorial de un número
- `esPrimo(n)`: Verifica si un número es primo

## Pruebas Implementadas

### Pruebas de Caja Blanca

Se han implementado 6 conjuntos de pruebas unitarias de caja blanca:

1. **Prueba de la función sumar**: Cobertura de decisiones
2. **Prueba de la función dividir**: Cobertura de decisiones y condiciones
3. **Prueba de la función factorial**: Cobertura de caminos y prueba de bucles
4. **Prueba de la función esPrimo**: Cobertura de decisiones múltiples
5. **Prueba de la función restar**: Cobertura de sentencias
6. **Prueba de la función multiplicar**: Cobertura de condiciones

### Pruebas de Caja Negra

Se han implementado 6 conjuntos de pruebas unitarias de caja negra:

1. **Prueba de la función sumar**: Particiones de equivalencia
2. **Prueba de la función dividir**: Análisis de valores límite
3. **Prueba de la función factorial**: Casos de uso típicos y atípicos
4. **Prueba de la función esPrimo**: Tabla de decisión
5. **Prueba de la función restar**: Particiones de equivalencia
6. **Prueba de la función multiplicar**: Análisis de valores límite

## Cómo ejecutar las pruebas

1. Instalar las dependencias:
   ```
   npm install
   ```

2. Ejecutar todas las pruebas:
   ```
   npm test
   ```

3. Ejecutar solo las pruebas de caja blanca:
   ```
   npx jest calculadora.test.js
   ```

4. Ejecutar solo las pruebas de caja negra:
   ```
   npx jest calculadora.caja-negra.test.js
   ```

## Resultados y Aportes a un Proceso de Auditoría

### Aportes de las Pruebas de Caja Blanca

Las pruebas unitarias de caja blanca son fundamentales en un proceso de auditoría de software ya que:

1. **Verifican la estructura interna del código**: Permiten comprobar que todos los caminos de ejecución funcionan correctamente.
2. **Detectan errores lógicos**: Ayudan a identificar problemas en la lógica del código que podrían pasar desapercibidos.
3. **Garantizan la robustez**: Verifican que el código maneja correctamente casos límite y entradas inválidas.
4. **Documentan el comportamiento esperado**: Sirven como documentación ejecutable del comportamiento esperado del código.
5. **Facilitan el mantenimiento**: Permiten realizar cambios en el código con la seguridad de que no se romperá la funcionalidad existente.

En un proceso de auditoría, estas pruebas demuestran que el código:
- Valida correctamente las entradas
- Maneja adecuadamente los errores
- Implementa correctamente la lógica de negocio
- No tiene vulnerabilidades evidentes

### Aportes de las Pruebas de Caja Negra

Las pruebas unitarias de caja negra complementan el proceso de auditoría al:

1. **Verificar la conformidad con requisitos**: Aseguran que el software cumple con las especificaciones funcionales.
2. **Evaluar desde la perspectiva del usuario**: Proporcionan una visión de cómo se comporta el software para el usuario final.
3. **Identificar problemas de interfaz**: Detectan errores en la forma en que el software interactúa con el exterior.
4. **Validar el manejo de entradas inválidas**: Comprueban que el software responde adecuadamente ante entradas inesperadas.
5. **Garantizar la robustez**: Verifican que el software funciona correctamente bajo diversas condiciones de uso.
