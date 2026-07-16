/**
 * FUNCIONES UTILIDADES
 */

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const formatTime = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getMatchStatus = (
  status: 'scheduled' | 'in_progress' | 'finished' | string
): string => {
  const statusMap: Record<string, string> = {
    scheduled: 'Próximo',
    in_progress: 'En juego',
    finished: 'Finalizado',
  };
  return statusMap[status] || 'Desconocido';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
