export const Header = () => {
  return (
    <header className="relative bg-[#FCC705] py-16 md:py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="home-hero-beam" />
      <div className="home-hero-beam-thin" />
      <div className="relative max-w-[1400px] mx-auto">
        <div className="home-anim-in flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 bg-[#1B1B1B] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-[3px_3px_0_0_rgba(27,27,27,0.25)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 18l6-6-6-6M8 6l-6 6 6 6"
              />
            </svg>
            Developer Portal
          </span>
          <div className="flex flex-col gap-6 w-full max-w-lg">
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
              Nayax API Suite
            </h1>
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              Payment processing APIs, POS terminal SDKs, transaction reporting, and inventory
              management, documented the way you actually read code.
            </p>
            <div className="flex items-center gap-4 w-full">
              <a
                href="/docs/get-started/nayax-different-integrations"
                className="flex-shrink-0 bg-[#1B1B1B] hover:bg-gray-800 text-white font-medium text-sm py-3.5 px-6 rounded-lg transition-colors no-underline shadow-[4px_4px_0_0_rgba(27,27,27,0.2)]"
              >
                Get started
              </a>
              <button
                onClick={() => document.querySelector('#search-bar-entry')?.click()}
                className="flex items-center flex-1 min-w-0 bg-white border border-gray-900/10 hover:border-gray-900/25 rounded-xl px-5 py-4 shadow-[4px_4px_0_0_rgba(27,27,27,0.1)] transition-colors text-left"
              >
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-gray-500 text-sm">Search the docs...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
