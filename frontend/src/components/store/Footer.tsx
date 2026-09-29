const Footer = () => {
  return (
    <footer className="border-t border-white/8 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-neutral-500 sm:flex-row">
        <p>Automarket &bull; Buy and sell with verified garage history</p>
        <div className="flex items-center gap-5">
          <a href="#" className="transition-colors hover:text-neutral-200">
            About
          </a>
          <a href="#" className="transition-colors hover:text-neutral-200">
            Help
          </a>
          <a href="#" className="transition-colors hover:text-neutral-200">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
