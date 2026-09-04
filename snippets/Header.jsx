export const Header = () => {
  return (
    <header className="relative bg-[#1B1B1B] py-16 md:py-20 px-6 md:px-12 lg:px-20 border-b border-gray-800 overflow-hidden">
      <div className="home-hero-glow" />
      <div className="home-hero-grid" />
      <div className="relative max-w-[1400px] mx-auto">
        <div className="home-anim-in flex flex-col items-start gap-7">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-2xl">
            Build on Nayax
          </h1>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-lg">
            Payment processing APIs, POS terminal SDKs, transaction reporting, and inventory
            management, documented the way you actually read code.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/docs/get-started/nayax-different-integrations"
              className="bg-[#FCC705] hover:bg-yellow-300 text-gray-900 font-medium text-sm py-3.5 px-6 rounded-lg transition-colors no-underline"
            >
              Get started
            </a>
            <button
              onClick={() => document.querySelector('#search-bar-entry')?.click()}
              className="flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 text-sm font-medium py-3.5 px-5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search the docs
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
