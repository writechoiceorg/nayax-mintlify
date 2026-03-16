export const AcceptPaymentsEcom = () => {

  // Refined icons with strokeWidth="2" for consistency
  const AuthIcon = () => (
    <svg width="46" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const FrontEndIcon = () => (
    <svg width="46" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );

  const BackEndIcon = () => (
    <svg width="46" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );

  const PaymentIcon = () => (
    <svg width="46" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );

  const ShieldCheckIcon = () => (
    <svg width="46" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFCD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 11 11 13 15 9" />
    </svg>
  );

  const cards = [
    {
      icon: <AuthIcon />,
      title: "Authenticate Requests",
      description: "Secure your API calls using Sign Keys, Secret Tokens, and signature generation.",
      link: "/docs/ecom-sdk/security-authentication/ecom-security-authentication",
    },
    {
      icon: <FrontEndIcon />,
      title: "Implement Front-End",
      description: "Deploy the Drop-in UI for Web and Mobile to handle secure payment collection.",
      link: "/docs/ecom-sdk/front-end-integration/front-end-sdk",
    },
    {
      icon: <BackEndIcon />,
      title: "Manage Back-End",
      description: "Handle the transaction lifecycle, recurring charges, and server-side sessions.",
      link: "/docs/ecom-sdk/back-end-integration/ecom-sdk-back-end-integration",
    },
    {
      icon: <PaymentIcon />,
      title: "Configure Methods",
      description: "Enable digital wallets like Apple Pay and Google Pay for your merchant domain.",
      link: "/docs/ecom-sdk/payment-methods/index",
    },
    {
      icon: <ShieldCheckIcon />,
      title: "Validate Webhooks",
      description: "Use HMAC signatures to verify the authenticity of incoming Nayax notifications.",
      link: "/docs/ecom-sdk/hmac-validation/index",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-white dark:bg-[#1B1B1B]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Integrate Online Payments
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl">
          Build a seamless checkout experience. Access everything you need to implement the Nayax eCom SDK into your web, iOS, or Android applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cards.map((card, index) => (
            <a 
              href={card.link} 
              key={index} 
              className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-[#262626] hover:border-yellow-400 dark:hover:border-yellow-400 transition-all no-underline"
            >
              <div className="relative w-14 h-14 flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full group-hover:bg-yellow-400/30 transition-colors"></div>
                <div className="relative z-10">{card.icon}</div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-500 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-0">
                {card.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};