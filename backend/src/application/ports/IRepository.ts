/**
 * INTERFAZ GENÉRICA DE REPOSITORIO
 * 
 * PRINCIPIO: Dependency Inversion (DIP)
 * - Application depende de abstracción, no de implementación
 * - Fácil de mockear para tests
 * - Fácil cambiar de Prisma a otra BD
 */

export interface IRepository<T> {
  /**
   * Crear nueva entidad
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Obtener por ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Obtener muchos con filtros
   */
  findMany(filters?: Record<string, any>): Promise<T[]>;

  /**
   * Actualizar
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Eliminar
   */
  delete(id: string): Promise<void>;
}
