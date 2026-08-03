import nexusLogo from "../assets/images/auth/nexus-logo.png";

export default function AuthLayout({ backgroundImage, overlayClassName, children }){
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat font-sans text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section
        className={[  //so this iverlayClassname is for some extra css for card like create account card is bigger than the login page card
          "flex min-h-screen items-center justify-center gap-[clamp(30px,8vw,120px)] p-[clamp(24px,5vw,70px)] max-[600px]:flex-col max-[600px]:justify-start max-[600px]:pt-[35px]",
          overlayClassName
        ].join(" ")}
      >
        <div className="shrink-0 grow-0 basis-auto">
          <img
            src={nexusLogo}
            alt="Nexus Chat Logo"
            className="aspect-square w-[clamp(120px,18vw,250px)] rounded-[55%] object-cover shadow-[0_20px_45px_rgba(20,20,20,0.45)]"/>
        </div>

        {children}
      </section>
    </main>
  );
}
