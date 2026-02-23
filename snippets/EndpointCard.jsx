export const EndpointCard = ({ method = "GET", title, children, href, arrow = true }) => {
  const METHOD_STYLES = {
    GET: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-300 dark:border-green-700",
    },
    POST: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-300 dark:border-blue-700",
    },
    PUT: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      border: "border-yellow-300 dark:border-yellow-700",
    },
    PATCH: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-300 dark:border-orange-700",
    },
    DELETE: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-300 dark:border-red-700",
    },
  };

  const MethodBadge = ({ method }) => {
    const style = METHOD_STYLES[method?.toUpperCase()] ?? METHOD_STYLES.GET;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${style.bg} ${style.text} ${style.border}`}
      >
        {method?.toUpperCase()}
      </span>
    );
  };
  const content = (
    <div className="group flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-[#1e1e1e] hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all cursor-pointer">
      {/* Method badge */}
      <div className="shrink-0">
        <MethodBadge method={method} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{title}</p>
        {children && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{children}</p>}
      </div>

      {/* Arrow */}
      {arrow && <Icon icon="arrow-up-right" />}
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block no-underline border-b-0">
      {content}
    </a>
  );
};
