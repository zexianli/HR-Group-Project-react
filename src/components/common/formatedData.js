export function formatMonthDay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
}
