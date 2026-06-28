export const dayMontYearFormat = (date: Date) => {
     return new Date(date).toLocaleString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
}

export const longDateTimeFormat = (value: string | Date) => {

  const dateInstance = value instanceof Date ? value : new Date(value)

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
    hour12: true
  }).format(dateInstance)

}

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};