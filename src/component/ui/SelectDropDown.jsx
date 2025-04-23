export default function SelectDropdown({
  className,
  onChange,
  value,
  items,
  placeholder = "선택",
  valueField = "name",
  labelField = "name",
  disabled = false,
}) {
  return (
    <select
      className={className}
      onChange={onChange}
      value={value}
      disabled={disabled}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {items &&
        items.map((item) => (
          <option key={item.id} value={item[valueField]}>
            {item[labelField]}
          </option>
        ))}
    </select>
  );
}
