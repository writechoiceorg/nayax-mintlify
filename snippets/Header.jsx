export const Header = () => {
  return (
    <header className="relative min-h-[380px] bg-gray-100 dark:bg-[#262626] py-16 px-6 md:px-12 lg:px-20 overflow-hidden flex items-center">
      <div className="relative max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 w-full">
        {/* Left content */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Nayax API Suite
          </h1>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-xl">
            Leverage Nayax's robust integrations to support your organization's business requirements.
          </p>
          <br />
          <br />
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            For more information,{" "}
            <a
              href="#contact"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors"
            >
              contact us
            </a>
          </p>
        </div>

        {/* Right content - Logo and Badge */}
        <div className="flex items-center gap-4">
          {/* Logo with dark mode support */}
          <img
            noZoom
            src="/images/home/logo_light.svg"
            alt="Nayax Logo"
            className="h-16 md:h-20 lg:h-24 w-auto dark:hidden"
          />
          <img
            noZoom
            src="/images/home/logo_dark.svg"
            alt="Nayax Logo"
            className="h-16 md:h-20 lg:h-24 w-auto hidden dark:block"
          />
        </div>
      </div>
    </header>
  );
};
