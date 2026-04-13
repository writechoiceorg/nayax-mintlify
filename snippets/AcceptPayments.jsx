export const AcceptPayments = () => {
  // Icons same as before
  const DynamicQRIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_362_679)">
        <path d="M19.5 9.5H10.5C9.67157 9.5 9 10.1716 9 11V20C9 20.8284 9.67157 21.5 10.5 21.5H19.5C20.3284 21.5 21 20.8284 21 20V11C21 10.1716 20.3284 9.5 19.5 9.5Z" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19.5 27.5H10.5C9.67157 27.5 9 28.1716 9 29V38C9 38.8284 9.67157 39.5 10.5 39.5H19.5C20.3284 39.5 21 38.8284 21 38V29C21 28.1716 20.3284 27.5 19.5 27.5Z" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M37.5 9.5H28.5C27.6716 9.5 27 10.1716 27 11V20C27 20.8284 27.6716 21.5 28.5 21.5H37.5C38.3284 21.5 39 20.8284 39 20V11C39 10.1716 38.3284 9.5 37.5 9.5Z" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M27 27.5V33.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M27 39.5H33V27.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M33 30.5H39" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M39 36.5V39.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs><clipPath id="clip0_362_679"><rect width="48" height="48" fill="white" transform="translate(0 0.5)" /></clipPath></defs>
    </svg>
  );

  const StaticQRIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_362_666)">
        <path d="M34.5 9.5H42V17" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.5 39.5H6V32" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M42 32V39.5H34.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 17V9.5H13.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 17V32" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M33 17V32" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M27 17V32" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21 17V32" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs><clipPath id="clip0_362_666"><rect width="48" height="48" fill="white" transform="translate(0 0.5)" /></clipPath></defs>
    </svg>
  );

  const EMVIntegrationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_362_657)">
        <path d="M42 11H6C5.17157 11 4.5 11.6716 4.5 12.5V36.5C4.5 37.3284 5.17157 38 6 38H42C42.8284 38 43.5 37.3284 43.5 36.5V12.5C43.5 11.6716 42.8284 11 42 11Z" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M31.5 32H37.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M22.5 32H25.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.5 18.5H43.5" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs><clipPath id="clip0_362_657"><rect width="48" height="48" fill="white" transform="translate(0 0.5)" /></clipPath></defs>
    </svg>
  );

  const ExternalPrepaidIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_362_650)">
        <path d="M7.5 11V35C7.5 35.7956 7.81607 36.5587 8.37868 37.1213C8.94129 37.6839 9.70435 38 10.5 38H40.5C40.8978 38 41.2794 37.842 41.5607 37.5607C41.842 37.2794 42 36.8978 42 36.5V15.5C42 15.1022 41.842 14.7206 41.5607 14.4393C41.2794 14.158 40.8978 14 40.5 14H10.5C9.70435 14 8.94129 13.6839 8.37868 13.1213C7.81607 12.5587 7.5 11.7956 7.5 11ZM7.5 11C7.5 10.2044 7.81607 9.44129 8.37868 8.87868C8.94129 8.31607 9.70435 8 10.5 8H36" stroke="#9BF8C9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M33.75 27.5C34.9926 27.5 36 26.4926 36 25.25C36 24.0074 34.9926 23 33.75 23C32.5074 23 31.5 24.0074 31.5 25.25C31.5 26.4926 32.5074 27.5 33.75 27.5Z" fill="#9BF8C9" />
      </g>
      <defs><clipPath id="clip0_362_650"><rect width="48" height="48" fill="white" transform="translate(0 0.5)" /></clipPath></defs>
    </svg>
  );

  const cards = [
    {
      icon: <ExternalPrepaidIcon />,
      title: "External Prepaid Card",
      description: "Accept closed-loop cards on Nayax devices via server-to-server authorization.",
      link: "/docs/cortina/prepaid-card/copy-of-prepaid-card-authorization",
    },
    {
      icon: <StaticQRIcon />,
      title: "Static QR",
      description: "Accept digital wallets or loyalty apps using simple static QR code integration.",
      link: "/docs/cortina/staticqr/static-qr-start",
    },
    {
      icon: <DynamicQRIcon />,
      title: "Dynamic QR",
      description: "Implement secure, dynamic QR scans for high-volume digital wallet payments.",
      link: "/docs/cortina/dynamicqr/dynamicqr-decline-reasons",
    },
    {
      icon: <EMVIntegrationIcon />,
      title: "EMV Integration",
      description: "Directly integrate EMV card payments through your preferred acquirer or gateway.",
      link: "/docs/cortina/credit-card/credit-card-decline-reasons",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-white dark:bg-[#1B1B1B]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          In-Person Payments
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-5xl">
          Accept customer apps, loyalty cards, or closed-loop methods on any Nayax POS via a Cortina integration.{" "}
          <a href="/docs/cortina/cortina-integration-process" className="text-blue-600 dark:text-blue-400 hover:underline">
            Learn More →
          </a>
        </p>

        {/* Changed lg:grid-cols-4 back to lg:grid-cols-3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.link}
              className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-[#262626] hover:border-green-400 dark:hover:border-green-400 transition-all no-underline flex flex-col"
            >
              <div className="relative w-14 h-14 flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-teal-400/20 dark:bg-green-400/10 rounded-full group-hover:bg-green-400/20 transition-colors"></div>
                <div className="relative z-10">{card.icon}</div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                {card.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                {card.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};