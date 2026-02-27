export const TerminalBlock = ({ children, variant, title }) => {
  if (variant === "ios") {
    return (
      <div className="rounded-xl overflow-hidden font-mono text-sm bg-[#1e2030]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2d3e] border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          {title && <span className="ml-2 text-xs text-white/40">{title}</span>}
        </div>
        {/* Content */}
        <pre className="m-0 p-5 text-[#a9b1d6] overflow-x-auto whitespace-pre leading-relaxed">{children}</pre>
      </div>
    );
  }
  return (
    <pre className="bg-black text-white text-sm font-mono w-full inline-block rounded-lg p-4 overflow-x-auto whitespace-pre">
      {children}
    </pre>
  );
};
