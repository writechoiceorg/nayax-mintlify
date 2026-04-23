export const Header = () => {
  return (
    <header className="relative min-h-[320px] bg-gradient-to-b from-gray-100 to-white dark:from-[#262626] dark:to-[#1B1B1B] py-10 px-6 md:px-12 lg:px-20 overflow-hidden flex items-center border-b border-gray-200 dark:border-gray-800">
      <div className="relative max-w-[1400px] mx-auto w-full">
        
        {/* Title and Description */}
        <div className="mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Nayax API Suite
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Leverage robust integrations to support your organization's business requirements.
              For more information, <a href="https://www.nayax.com/contact/" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</a>.
            </p>
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