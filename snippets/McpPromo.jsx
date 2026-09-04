export const McpPromo = () => {
  return (
    <a
      href="/docs/get-started/build-with-ai"
      className="group relative flex items-center gap-3 bg-[#1B1B1B] hover:bg-[#242424] no-underline py-4 pl-8 pr-6 md:pl-14 md:pr-12 lg:pl-20 lg:pr-20 transition-colors"
      style={{ borderBottom: "none" }}
    >
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#6352E0]" />
      <span className="absolute left-0 right-0 bottom-0 h-px bg-gray-800" />
      <span className="w-2 h-2 rounded-full bg-[#FCC705] flex-shrink-0" />
      <span className="text-sm font-medium text-white">Connect an AI assistant via MCP</span>
      <span className="text-xs font-semibold text-gray-900 bg-[#FCC705] px-2 py-0.5 rounded-full">New</span>
      <svg
        className="w-4 h-4 text-gray-500 group-hover:text-[#FCC705] group-hover:translate-x-0.5 transition-all"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
};
