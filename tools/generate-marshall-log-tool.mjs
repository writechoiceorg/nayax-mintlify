// Generates snippets/MarshallLogTool.jsx from tools/marshall-log-tool.html.
//
// The Marshall Log Trace Comparator ships as a standalone HTML document, but
// Mintlify's production build does not serve raw .html files. This script
// ports the tool into a native Mintlify React component that renders the
// tool's exact markup, CSS, and script inside a shadow root (for style
// isolation) on the docs page. Same approach as
// tools/generate-spark-auth-tool.mjs, including the dark-mode sync (the tool
// ships a light default and a `:root.dark, :host(.dark)` override, same
// convention as Spark's). Simplified in one way: this tool has no hash-based
// deep-linking, so there's no tab-routing to port.
//
// To update when the client sends a new tool version:
//   1. Replace tools/marshall-log-tool.html with the new file.
//   2. Run:  node tools/generate-marshall-log-tool.mjs
//   3. Commit the regenerated snippets/MarshallLogTool.jsx.
//
// The port is faithful: CSS and script are copied verbatim, with only the
// minimal transforms needed to run inside a shadow root (documented below).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HTML = path.join(root, "tools", "marshall-log-tool.html");
const OUT = path.join(root, "snippets", "MarshallLogTool.jsx");

const src = fs.readFileSync(HTML, "utf8");

const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const bodyFull = src.match(/<body>([\s\S]*?)<script>/)[1];

// The tool ships two separate <script> blocks in sequence -- the bundled
// SheetJS library, then the app code that calls into it (XLSX.read, etc.).
// Both run in the same global scope in the original file, so concatenate
// them in order into one script for the shadow-root port.
const script = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .join("\n");

// Drop the tool's own top banner (title/eyebrow + link back to the Marshall
// SDK docs): redundant inside the docs page, which carries its own title and
// intro, and there is no <head>/<html> in a shadow root.
const body = bodyFull.replace(/<div class="topbar">[\s\S]*?<\/div>\s*<\/div>/, "").trim();

// CSS transforms for shadow-root context:
//  - :root and html,body have no match inside a shadow tree, so move their
//    rules to :host (custom properties + base font/colour inherit into the
//    shadow tree).
//  - the standalone body{} rule sizes the tool for a standalone browser tab
//    (min-height:100vh); neutralise that so it flows with the docs page
//    instead of forcing a full viewport height.
const cssT = css
  .replace(/:root\{/, ":host{")
  .replace(/\bhtml,body\{/, ":host{")
  .replace(/\bbody\{ min-height:100vh; padding-bottom:80px; \}/, ":host{ min-height:0; }");

// Script transform: the tool only ever looks elements up via
// document.getElementById (no querySelectorAll), so redirect that at the
// shadow root. document.createElement / document.body.appendChild /
// removeChild stay on the real document -- those back the "Download report"
// file-save, which has to go through the real DOM.
const scriptT = script.replaceAll(
  "document.getElementById(",
  "(window.__mlaRoot||document).getElementById("
);

// Note: the CSS/BODY/SCRIPT constants are declared INSIDE the component on
// purpose. Mintlify's production bundler evaluates the exported component in
// isolation and drops non-exported module-level declarations, so anything the
// component references must live within its own scope.
const out = `// AUTO-GENERATED from tools/marshall-log-tool.html by tools/generate-marshall-log-tool.mjs
// Do not edit by hand. To update, replace the .html and re-run the generator.
export const MarshallLogTool = () => {
  const CSS = ${JSON.stringify(cssT)};
  const BODY = ${JSON.stringify(body)};
  const SCRIPT = ${JSON.stringify(scriptT)};
  const mount = (host) => {
    if (!host || typeof window === "undefined") return;
    if (!host.shadowRoot) {
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = "<style>" + CSS + "</style>" + BODY;
      window.__mlaRoot = root;
      if (!window.__mlaLoaded) {
        window.__mlaLoaded = true;
        const s = document.createElement("script");
        s.textContent = SCRIPT;
        document.body.appendChild(s);
      }
    } else {
      window.__mlaRoot = host.shadowRoot;
    }
    // Sync with the docs site's own dark/light toggle: Mintlify puts a
    // literal "dark" class on <html>, but the tool lives in a shadow root
    // that CSS from the host page can't reach, so mirror that class onto
    // the shadow host itself (the tool's stylesheet reacts via :host(.dark)).
    const syncTheme = function () {
      host.classList.toggle("dark", document.documentElement.classList.contains("dark"));
    };
    syncTheme();
    if (!host.__mlaThemeObserver) {
      host.__mlaThemeObserver = new MutationObserver(syncTheme);
      host.__mlaThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }
  };
  return <div ref={mount} style={{ width: "100%" }} />;
};
`;

fs.writeFileSync(OUT, out);
console.log("Wrote " + OUT + " (" + out.length + " bytes)");
