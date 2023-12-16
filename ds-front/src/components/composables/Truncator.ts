import { ref } from 'vue';

export default function useTruncate() {
  const result = ref('');

  function truncate(str: string, limit: number): void {
    result.value = str.length > limit ? str.substring(0, limit) + '...' : str;
  }

  return {
    result,
    truncate,
  };
}
