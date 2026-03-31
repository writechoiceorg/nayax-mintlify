export const McpPromo = () => {
  const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FCC705" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <circle cx="9" cy="14" r="1" fill="#FCC705" stroke="none" />
      <circle cx="15" cy="14" r="1" fill="#FCC705" stroke="none" />
    </svg>
  );

  return (
    <section className="py-6 px-6 md:px-12 lg:px-20 bg-[#6352E0]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0">
            <AIIcon />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              Get AI-powered help with our MCP Server
              <span className="text-xs font-semibold bg-[#FCC705] text-gray-900 px-2 py-0.5 rounded-full">New</span>
            </h2>
            <p className="text-purple-200 text-sm">
              Give your AI assistant direct access to Nayax documentation and get instant answers about integrations, APIs, and payment flows.
            </p>
          </div>
        </div>
        <a
          href="/docs/get-started/mcp-setup"
          className="flex-shrink-0 bg-[#FCC705] hover:bg-yellow-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-all no-underline whitespace-nowrap text-sm"
        >
          Connect Now
        </a>
      </div>
    </section>
  );
};
