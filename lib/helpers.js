export default function changeTypeName(tab) {
  let type;
  if (tab === "공정") type = "process";
  else if (tab === "품명") type = "product";
  else if (tab === "단위") type = "unit";
  else if (tab === "규격") type = "scale";
  return type;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minutes}`;
}

export function formatWon(won) {
  return (won ? won.toLocaleString('ko-KR') : 0) + "원" ;
}
