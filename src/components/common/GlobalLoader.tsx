import Logo from "@/assets/splash/zodimithra.gif";

const GlobalLoader = () => {
  return (
    <section className="flex h-screen w-[calc(100%+2rem)] -m-4 items-center justify-center bg-white">
      <div className="text-center">
        <img
          src={Logo}
          alt="Zodimithra Logo"
          className="mx-auto w-1/2 max-w-xs"
          loading="eager"
        />
        <h2 className="text-[#E4B360] pl-4 animate-pulse tracking-[1px] font-body-content font-semibold text-xl">
          LOADING...
        </h2>
      </div>
    </section>
  );
};

export default GlobalLoader;
