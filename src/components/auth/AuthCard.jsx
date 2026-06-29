export default function AuthCard({ children }){
  return (
    <div className="w-[min(100%,520px)] rounded-[20px] bg-[rgba(20,20,20,0.55)] p-[clamp(30px,5vw,50px)] shadow-[0_15px_40px_rgba(0,0,0,0.35)] backdrop-blur-[15px] max-[600px]:w-full">
      {children}
    </div>
  );
}
