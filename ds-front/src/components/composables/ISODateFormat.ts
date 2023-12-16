import { ref } from 'vue';

export default function useISODateFormat(initialDate = new Date()) {
  const date = ref(initialDate);

  const formatDate = (daysOffset = 0) => {
    const newDate = new Date(date.value);
    newDate.setDate(newDate.getDate() + daysOffset);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return {
    date,
    formatDate,
  };
}
