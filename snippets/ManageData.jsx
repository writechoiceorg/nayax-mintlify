export const ManageData = () => {
  // Placeholder SVG icons - replace with your actual SVG code
  const SalesAlertsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_281_570)">
        <path
          d="M6 18.5V38C6 38.3978 6.15804 38.7794 6.43934 39.0607C6.72064 39.342 7.10218 39.5 7.5 39.5H40.5C40.8978 39.5 41.2794 39.342 41.5607 39.0607C41.842 38.7794 42 38.3978 42 38V18.5L24 6.5L6 18.5Z"
          stroke="#6352E0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20.7279 29L6.46289 39.0763"
          stroke="#6352E0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M41.5365 39.0763L27.2715 29"
          stroke="#6352E0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M42 18.5L27.2738 29H20.7281L6 18.5"
          stroke="#6352E0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_281_570">
          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );

  const OperationsAPIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="51" height="54" viewBox="0 0 51 54" fill="none">
      <circle cx="23" cy="30.332" r="23" fill-opacity="0.8" />
      <g clip-path="url(#clip0_281_467)">
        <path
          d="M29.1463 12.7955L31.2088 10.733C32.0205 9.92104 32.9842 9.27694 34.0449 8.8375C35.1056 8.39806 36.2425 8.17187 37.3906 8.17188C38.5388 8.17187 39.6756 8.39806 40.7363 8.8375C41.797 9.27694 42.7608 9.92104 43.5725 10.733C44.3845 11.5447 45.0286 12.5085 45.468 13.5692C45.9075 14.6299 46.1336 15.7668 46.1336 16.9149C46.1336 18.063 45.9075 19.1999 45.468 20.2606C45.0286 21.3213 44.3845 22.285 43.5725 23.0968L39.0013 27.668L37.0625 29.6068C36.2498 30.4196 35.2849 31.0642 34.2228 31.5037C33.1607 31.9432 32.0225 32.1689 30.8731 32.1681C29.7237 32.1672 28.5857 31.9397 27.5243 31.4986C26.463 31.0575 25.499 30.4114 24.6875 29.5974C23.8476 28.7578 23.1881 27.7554 22.7496 26.6517C22.3111 25.548 22.1028 24.3663 22.1375 23.1793"
          stroke="#6352E0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M24.1292 36.5406L22.0667 38.6031C21.254 39.4159 20.289 40.0605 19.2269 40.5C18.1649 40.9395 17.0266 41.1653 15.8772 41.1644C14.7278 41.1635 13.5899 40.936 12.5285 40.4949C11.4671 40.0538 10.5031 39.4078 9.69165 38.5937C8.05663 36.953 7.1395 34.7305 7.14161 32.4142C7.14371 30.0979 8.06489 27.8771 9.7029 26.2393L16.2129 19.7293C17.0246 18.9174 17.9884 18.2733 19.0491 17.8338C20.1098 17.3944 21.2467 17.1682 22.3948 17.1682C23.5429 17.1682 24.6798 17.3944 25.7405 17.8338C26.8012 18.2733 27.7649 18.9174 28.5767 19.7293C29.42 20.5689 30.0824 21.5724 30.5229 22.6778C30.9635 23.7833 31.1727 24.9673 31.1379 26.1568"
          stroke="#6352E0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_281_467">
          <rect width="48" height="48" fill="white" transform="translate(2.6377 0.667969)" />
        </clipPath>
      </defs>
    </svg>
  );

  const cards = [
    {
      icon: <SalesAlertsIcon />,
      title: "Real-Time Sales & Alerts",
      arrow: "Amazon SQS",
      description:
        "Retrieve real-time information on your sales and operations, including transactions, machine telemetry, and alerts via Amazon SQS services.",
      link: "#amazon-sqs",
    },
    {
      icon: <OperationsAPIIcon />,
      title: "Operations & Management API",
      arrow: "Lynx",
      description:
        "Connect to the Nayax Core management platform and manage your machines, devices, inventory, and prepaid cards from your own environment.",
      link: "#lynx",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-white dark:bg-[#1B1B1B]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Manage Data & Operations
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-5xl">
          Manage operations and monitor transactions from the comfort of your existing business applications (ERP, CRM,
          VMS, CPMS).
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-[#262626] hover:shadow-lg transition-shadow"
            >
              {/* Icon */}
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                {/* Purple circle background */}
                <div className="absolute inset-0 bg-purple-400/20 dark:bg-purple-400/10 rounded-full"></div>
                {/* SVG Icon */}
                <div className="relative z-10">{card.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {card.title} → {card.arrow}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 block">{card.description}</p>

              {/* Link */}
              <a
                href={card.link}
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Learn More
                <span className="text-sm">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
