export const IntegratePOS = () => {
  // Placeholder SVG icons - replace with your actual SVG code
  const AttendedDeviceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="48" viewBox="0 0 46 48" fill="none">
      <g clipPath="url(#clip0_371_481)">
        <path
          d="M16.9056 5.80518H12.853C11.6525 5.80518 10.6777 6.77998 10.6777 7.98043V45.6186C10.6777 47.0899 11.8692 48.2813 13.3404 48.2813H32.8545C34.3257 48.2813 35.5171 47.0899 35.5171 45.6186V7.98043C35.5171 6.77998 34.5423 5.80518 33.3419 5.80518"
          stroke="#FFCD00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M29.9743 10.3365V1.62646L27.6727 2.94425L25.3801 1.62646L23.0965 2.94425L20.8039 1.62646L18.5113 2.94425L16.2188 1.62646V10.3365"
          stroke="#FFCD00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M15.5 10.3364H30.6941" stroke="#FFCD00" strokeWidth="1.5" strokeLinejoin="round" />
        <path
          d="M32.647 13.7932H13.5391V44.0572H32.647V13.7932Z"
          stroke="#FFCD00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M33.5766 5.80518H30.1377"
          stroke="#FFCD00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_371_481">
          <rect width="26.1843" height="48.555" fill="white" transform="translate(10 0.316406)" />
        </clipPath>
      </defs>
    </svg>
  );

  const UnattendedDeviceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="54" viewBox="0 0 46 54" fill="none">
      <circle cx="23" cy="30.1836" r="23" fill-opacity="0.8" />
      <g clip-path="url(#clip0_371_464)">
        <path
          d="M36.2071 41.8164H8.62353C7.72916 41.8164 7.00195 41.0511 7.00195 40.1175V2.51528C7.00195 1.58174 7.72916 0.816406 8.62353 0.816406H36.2071C37.1015 0.816406 37.8287 1.58174 37.8287 2.51528V40.1175C37.8287 41.0511 37.1015 41.8164 36.2071 41.8164ZM8.62353 1.86769C8.3059 1.86769 8.04679 2.16205 8.04679 2.51528V40.1175C8.04679 40.4708 8.3059 40.7651 8.62353 40.7651H36.2071C36.5247 40.7651 36.7839 40.4708 36.7839 40.1175V2.51528C36.7839 2.16205 36.5247 1.86769 36.2071 1.86769H8.62353Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M39.4753 40.4623C39.1827 40.4623 38.957 40.2268 38.957 39.9409V2.69185C38.957 2.39749 39.1911 2.17041 39.4753 2.17041C39.7595 2.17041 39.9935 2.4059 39.9935 2.69185V39.9325C39.9935 40.2268 39.7595 40.4539 39.4753 40.4539V40.4623Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M34.1757 37.2326L33.9249 37.199L33.0055 36.9719L30.0465 36.0973L26.4857 35.3908L22.2897 35.0796L18.6871 35.2394L15.118 35.8029L12.1757 36.543L11.4234 36.7701L11.1058 36.7533L10.6628 36.5009L10.4204 36.1141L10.8968 35.8954L10.3702 35.9627L10.3535 35.8197L10.387 4.73541L10.5541 4.35695L10.7882 4.12987L11.1225 4.54197L10.8801 4.071L11.0891 3.9869L11.2479 3.96167L19.1886 3.81869L20.1833 3.40659L20.852 3.01972L21.412 2.85992L22.0222 2.81787L22.7828 2.93561L23.5351 3.28885L24.488 3.75141L25.5161 3.95326H25.6917L32.3452 3.97849L32.9135 4.34013L33.064 4.60926L32.5876 4.82792L33.1142 4.75223L33.1392 4.90361L33.3649 9.5629L33.599 11.0347L33.9751 12.6915L34.1924 13.4232L35.2623 15.2566V15.551L35.0784 36.5935L34.8695 36.9383L34.4599 36.6019L34.7608 37.0392L34.5518 37.1654L34.2008 37.2326H34.1757ZM34.3345 36.3159L34.602 36.3496L34.4348 36.2739H34.2844L34.3429 36.3243L34.3345 36.3159ZM22.3064 34.0283L25.3907 34.2049L28.4667 34.6591L32.1028 35.5674L33.298 35.9543L34.1005 36.1477L34.2259 15.5342L34.1924 15.4417L33.181 13.7764L32.738 12.1028L32.3117 9.68064L32.1362 7.66218L32.0777 5.00454L24.6803 4.88679L23.2175 4.32331L22.3733 3.90279L21.9804 3.85233L21.1278 4.03736L19.7403 4.73541L18.4781 4.98772H18.1856H11.3983V35.6767L16.1294 34.5329L19.2137 34.1461L22.3064 34.0367V34.0283ZM34.5936 15.4164L34.4181 15.4921L34.719 15.4164H34.5936Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M29.2268 32.0185C29.0345 32.0185 28.8339 31.9933 28.6333 31.9596L28.5163 31.9428C28.1819 31.9008 27.7975 31.8419 27.3712 31.7746C25.8415 31.5475 23.7351 31.228 21.9297 31.228C19.5809 31.228 16.7891 31.556 15.3347 31.7494L15.2093 31.7662C14.7329 31.8335 14.2313 31.9008 13.8636 31.5728C13.5125 31.2616 13.4707 30.757 13.4707 30.4038V10.3958H30.3803V30.5972C30.3803 30.9504 30.3385 31.455 29.9874 31.7578C29.7701 31.9512 29.5026 32.0101 29.2268 32.0101V32.0185ZM21.9297 30.1851C23.8187 30.1851 25.9585 30.5047 27.53 30.7402C27.9479 30.8074 28.3324 30.8579 28.6584 30.9084L28.7838 30.9252C28.976 30.9504 29.2268 30.9841 29.3187 30.9672C29.3187 30.9504 29.3438 30.8579 29.3438 30.6056V11.447H14.5155V30.4122C14.5155 30.7149 14.5657 30.799 14.5657 30.799C14.6075 30.799 14.875 30.757 15.0756 30.7318L15.2009 30.7149C16.6804 30.5131 19.5224 30.1851 21.9297 30.1851Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M17.6412 7.98204C17.6412 7.88952 17.566 7.80542 17.4824 7.80542H15.8776C15.7856 7.80542 15.7188 7.88111 15.7188 7.98204V8.20911C15.7188 8.30162 15.794 8.38573 15.8776 8.38573H17.4824C17.5744 8.38573 17.6412 8.31003 17.6412 8.20911V7.98204Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M21.2018 7.98204C21.2018 7.88952 21.1266 7.80542 21.043 7.80542H19.4381C19.3462 7.80542 19.2793 7.88111 19.2793 7.98204V8.20911C19.2793 8.30162 19.3545 8.38573 19.4381 8.38573H21.043C21.1349 8.38573 21.2018 8.31003 21.2018 8.20911V7.98204Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M24.7623 7.98204C24.7623 7.88952 24.6871 7.80542 24.6035 7.80542H22.9987C22.9067 7.80542 22.8398 7.88111 22.8398 7.98204V8.20911C22.8398 8.30162 22.9151 8.38573 22.9987 8.38573H24.6035C24.6955 8.38573 24.7623 8.31003 24.7623 8.20911V7.98204Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M28.3248 7.98204C28.3248 7.88952 28.2496 7.80542 28.166 7.80542H26.5612C26.4692 7.80542 26.4023 7.88111 26.4023 7.98204V8.20911C26.4023 8.30162 26.4776 8.38573 26.5612 8.38573H28.166C28.258 8.38573 28.3248 8.31003 28.3248 8.20911V7.98204Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M21.9966 4.39087C21.6455 4.39087 21.3613 4.70205 21.3613 5.08051C21.3613 5.45897 21.6455 5.77015 21.9966 5.77015C22.3477 5.77015 22.6318 5.45897 22.6318 5.08051C22.6318 4.70205 22.3477 4.39087 21.9966 4.39087Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path
          d="M17.5335 39.5539C17.5335 39.5539 17.3412 38.9063 17.7675 38.654C18.1186 38.4438 21.788 36.2908 21.788 36.2908C21.788 36.2908 22.2561 36.0216 22.8329 36.2908C23.4096 36.5599 26.4104 38.5952 26.4104 38.5952C26.4104 38.5952 26.9955 38.9736 26.7865 39.5455H17.5418L17.5335 39.5539Z"
          fill="#FFCD00"
          stroke="#FFCD00"
          stroke-width="0.5"
        />
        <path d="M29.8628 21.0347H13.998V22.086H29.8628V21.0347Z" fill="#FFCD00" stroke="#FFCD00" stroke-width="0.5" />
      </g>
      <defs>
        <clipPath id="clip0_371_464">
          <rect width="33" height="41" fill="white" transform="translate(7 0.816406)" />
        </clipPath>
      </defs>
    </svg>
  );

  const EmbeddedDeviceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_281_543)">
        <path
          d="M42 11H6C5.17157 11 4.5 11.6716 4.5 12.5V36.5C4.5 37.3284 5.17157 38 6 38H42C42.8284 38 43.5 37.3284 43.5 36.5V12.5C43.5 11.6716 42.8284 11 42 11Z"
          stroke="#FFCD00"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M31.5 32H37.5" stroke="#FFCD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M22.5 32H25.5" stroke="#FFCD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.5 18.5H43.5" stroke="#FFCD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_281_543">
          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );

  const RemoteDeviceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24.499" cy="30.5" r="23" fill-opacity="0.8" />
      <g clip-path="url(#clip0_371_504)">
        <path
          d="M39 27.5H9C8.17157 27.5 7.5 28.1716 7.5 29V38C7.5 38.8284 8.17157 39.5 9 39.5H39C39.8284 39.5 40.5 38.8284 40.5 38V29C40.5 28.1716 39.8284 27.5 39 27.5Z"
          stroke="#FFCD00"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M39 9.5H9C8.17157 9.5 7.5 10.1716 7.5 11V20C7.5 20.8284 8.17157 21.5 9 21.5H39C39.8284 21.5 40.5 20.8284 40.5 20V11C40.5 10.1716 39.8284 9.5 39 9.5Z"
          stroke="#FFCD00"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M33.75 17.75C34.9926 17.75 36 16.7426 36 15.5C36 14.2574 34.9926 13.25 33.75 13.25C32.5074 13.25 31.5 14.2574 31.5 15.5C31.5 16.7426 32.5074 17.75 33.75 17.75Z"
          fill="#FFCD00"
        />
        <path
          d="M33.75 35.75C34.9926 35.75 36 34.7426 36 33.5C36 32.2574 34.9926 31.25 33.75 31.25C32.5074 31.25 31.5 32.2574 31.5 33.5C31.5 34.7426 32.5074 35.75 33.75 35.75Z"
          fill="#FFCD00"
        />
      </g>
      <defs>
        <clipPath id="clip0_371_504">
          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );

  const EVChargerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="54" viewBox="0 0 48 54" fill="none">
      <circle cx="24" cy="30.5" r="23" />
      <g clip-path="url(#clip0_281_561)">
        <path
          d="M21 32L24 24.5H18L21 17"
          stroke="#FFCD00"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.5 41V11C10.5 10.2044 10.8161 9.44129 11.3787 8.87868C11.9413 8.31607 12.7044 8 13.5 8H28.5C29.2956 8 30.0587 8.31607 30.6213 8.87868C31.1839 9.44129 31.5 10.2044 31.5 11V41"
          stroke="#FFCD00"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M6 41H36" stroke="#FFCD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M31.5 21.5H36C36.7956 21.5 37.5587 21.8161 38.1213 22.3787C38.6839 22.9413 39 23.7044 39 24.5V32C39 32.7956 39.3161 33.5587 39.8787 34.1213C40.4413 34.6839 41.2044 35 42 35C42.7956 35 43.5587 34.6839 44.1213 34.1213C44.6839 33.5587 45 32.7956 45 32V16.7431C45.0001 16.3489 44.9224 15.9586 44.7715 15.5944C44.6207 15.2302 44.3995 14.8993 44.1206 14.6206L40.5 11"
          stroke="#FFCD00"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_281_561">
          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
  const cards = [
    {
      icon: <AttendedDeviceIcon />,
      title: "Attended Retail Devices",
      arrow: "TweezerComm",
      description:
        "Integrate Nayax's attended payment device (Nova line) with your Point of Sale, utilizing physical connectivity.",
      link: "#tweezercomm",
      comingSoon: false,
    },
    {
      icon: <UnattendedDeviceIcon />,
      title: "Unattended Devices",
      arrow: "Marshall",
      description:
        "Connect any unattended machine with Nayax's payment devices (VPOS Touch, Onyx), utilizing physical connectivity.",
      link: "#marshall",
      comingSoon: false,
    },
    {
      icon: <EmbeddedDeviceIcon />,
      title: "Embedded Devices",
      arrow: "EMV Core",
      description: "Connect any unattended machine with embedded Nayax payment devices (Uno line).",
      link: "#emv-core",
      comingSoon: false,
    },
    {
      icon: <RemoteDeviceIcon />,
      title: "Remote Device Integration",
      arrow: "Spark",
      description:
        "Remotely integrate your platform with Nayax devices (server-to-server integration). Ideal for POS and platform integrations.",
      link: "#spark",
      comingSoon: false,
    },
    {
      icon: <EVChargerIcon />,
      title: "EV Charger Integration",
      arrow: "OCPI",
      description:
        "Easily integrate your EV platform to Nayax payment devices based on the Open Charge Point Interface protocol (OCPI).",
      link: "#ocpi",
      comingSoon: true,
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-white dark:bg-[#1B1B1B]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Integrate POS Devices
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl">
          Integrate Nayax POS with your machines, kiosks, EV chargers, or any application.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-[#262626] hover:shadow-lg transition-shadow"
            >
              {/* Icon */}
              <div className="relative w-14 h-14 flex items-center justify-center mb-4">
                {/* Yellow circle background */}
                <div className="absolute inset-0 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full"></div>
                {/* SVG Icon */}
                <div className="relative z-10">{card.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {card.title} → {card.arrow}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 min-h-[80px] block">
                {card.description}
              </p>

              {/* Link or Badge */}
              {card.comingSoon ? (
                <span className="inline-block bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 font-bold text-sm px-4 py-2 rounded-md">
                  Coming Soon
                </span>
              ) : (
                <a
                  href={card.link}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Learn More
                  <span className="text-sm">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
