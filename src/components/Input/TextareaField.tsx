export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  maxLength: number;
}) {
  return (
    <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 flex-grow min-h-[95px]">
      <label className="text-neutral-500 mb-0.5">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="grow outline-none bg-transparent w-full h-full text-gray-900 mb-5"
        placeholder={placeholder}
      />
      <div className="absolute bottom-2 right-4 text-xs text-gray-500">
        {value.length} / {maxLength}
      </div>
    </div>
  );
}
