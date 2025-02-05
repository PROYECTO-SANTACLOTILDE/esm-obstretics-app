export const formatDateIntl = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date).replace('.', '');
  };