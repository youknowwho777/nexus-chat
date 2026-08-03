export default function PrimaryButton({ children, disabled }){
  return ( // just the login/create button reusable
    <button
      type="submit"
      disabled={disabled}
      className="mt-2.5 rounded-xl border-0 bg-blue-600 p-[clamp(14px,3vw,16px)] text-[1.05rem] font-bold text-white transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}
