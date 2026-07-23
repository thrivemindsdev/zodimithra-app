const Banner = ({ title, description, bgImage, rightImage }: any) => {
  return (
    <div
      className="relative flex items-center justify-between rounded-2xl px-5 py-4 min-h-30 bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Content */}
      <div className="z-10 max-w-[60%]">
        <h2 className="text-lg font-header text-white font-light">
          {title}
        </h2>

        <p className="mt-3 text-xs font-body text-white/90 leading-5">
          {description}
        </p>
      </div>

      {/* Illustration */}
      <div className="absolute right-2 -top-6">
        <img
          src={rightImage}
          alt="Healing"
          className="w-36 h-36 object-contain md:w-36 md:h-36"
        />
      </div>
    </div>
  );
};

export default Banner;
