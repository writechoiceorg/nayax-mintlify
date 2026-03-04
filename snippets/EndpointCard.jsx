export const EndpointCard = ({ method = "API", title, children, href, arrow = true }) => {
  const METHOD_STYLES = {
    GET: {
      bg: "mint-bg-green-400/20 dark:mint-bg-green-400/20",
      text: "mint-text-green-700 dark:mint-text-green-400",
      border: "mint-border-green-300 dark:mint-border-green-700",
    },
    POST: {
      bg: "mint-bg-blue-400/20 dark:mint-bg-blue-400/20",
      text: "mint-text-blue-700 dark:mint-text-blue-400",
    },
    PUT: {
      bg: "mint-bg-yellow-400/20 dark:mint-bg-yellow-400/20",
      text: "mint-text-yellow-700 dark:mint-text-yellow-400",
    },
    PATCH: {
      bg: "mint-bg-orange-400/20 dark:mint-bg-orange-400/20",
      text: "mint-text-orange-700 dark:mint-text-orange-400",
    },
    DELETE: {
      bg: "mint-bg-red-400/20 dark:mint-bg-red-400/20",
      text: "mint-text-red-700 dark:mint-text-red-400",
    },
    API: {
      bg: "mint-bg-black",
      text: "mint-text-white",
    },
  };

  const MethodBadge = ({ method }) => {
    const style = METHOD_STYLES[method?.toUpperCase()] ?? METHOD_STYLES.GET;
    return (
      <span
        className={`
          method-pill rounded-lg font-bold px-1.5 py-0.5 text-xs leading-5 ${style.bg} ${style.text}`}
      >
        {method?.toUpperCase()}
      </span>
    );
  };
  const content = (
    <div className="group flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-[#1e1e1e] hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all cursor-pointer">
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{title}</p>
        {children && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{children}</p>}
      </div>

      {/* Method badge */}
      <div className="shrink-0">
        <MethodBadge method={method} />
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block no-underline border-b-0 mb-2">
      {content}
    </a>
  );
};
