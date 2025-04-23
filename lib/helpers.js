export default function changeTypeName(tab) {
  let type;
  if (tab === "공정") type = "process";
  else if (tab === "품명") type = "product";
  else if (tab === "단위") type = "unit";
  else if (tab === "규격") type = "scale";
  return type;
}