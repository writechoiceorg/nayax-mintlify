export const Header = () => {
  return (
    <header className="relative min-h-[320px] bg-gradient-to-b from-gray-100 to-white dark:from-[#262626] dark:to-[#1B1B1B] py-10 px-6 md:px-12 lg:px-20 overflow-hidden flex items-center border-b border-gray-200 dark:border-gray-800">
      <div className="relative max-w-[1400px] mx-auto w-full">
        
        {/* Top Row: Title and Logo */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Nayax API Suite
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Leverage robust integrations to support your organization's business requirements.
              For more information, <a href="https://www.nayax.com/contact/" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</a>.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img noZoom src="/images/home/logo_light.svg" alt="Nayax Logo" className="h-12 md:h-16 w-auto dark:hidden" />
            <img noZoom src="/images/home/logo_dark.svg" alt="Nayax Logo" className="h-12 md:h-16 w-auto hidden dark:block" />
          </div>
        </div>

        {/* Bottom Row: Search Bar (The Glean Style) */}
        <div className="max-w-3xl">
          <button 
            onClick={() => document.querySelector('#search-bar-entry')?.click()}
            className="flex items-center w-full bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600 rounded-2xl px-6 py-4 shadow-xl transition-all hover:border-yellow-400 group"
          >
            <svg 
              className="w-6 h-6 text-gray-400 group-hover:text-yellow-500 transition-colors mr-4" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-500 dark:text-gray-400 text-lg">
              Search for integration guides or API references...
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};