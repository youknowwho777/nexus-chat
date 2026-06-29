export default function FormInput({
  id,
  type,
  value,
  error,
  placeholder,
  autoComplete,
  onChange
}){
  return (
    <div className="flex flex-col gap-1.5">
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-error`}
        onChange={onChange}
        className={[
          "w-full rounded-xl border-0 bg-[#2c2c2c] px-[18px] py-[clamp(14px,3vw,18px)] text-base text-white placeholder:text-white focus:outline-none",
          error
            ? "shadow-[0_0_0_2px_rgba(248,113,113,0.9)]"
            : "focus:shadow-[0_0_4px_3px_rgba(78,175,231,0.75)]"
        ].join(" ")}
      />
      <span id={`${id}-error`} className="min-h-[18px] text-[0.85rem] leading-[1.3] text-red-200">
        {error}
      </span>
    </div>
  );
}
