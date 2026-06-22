// Generates snippets/SparkAuthTool.jsx from tools/spark-auth-tool.html.
//
// The Spark Auth Tool ships as a standalone HTML document, but Mintlify's
// production build does not serve raw .html files. This script ports the tool
// into a native Mintlify React component that renders the tool's exact markup,
// CSS, and script inside a shadow root (for style isolation) on the docs page.
//
// To update when the client sends a new tool version:
//   1. Replace tools/spark-auth-tool.html with the new file.
//   2. Run:  node tools/generate-spark-auth-tool.mjs
//   3. Commit the regenerated snippets/SparkAuthTool.jsx.
//
// The port is faithful: CSS and script are copied verbatim, with only the
// minimal transforms needed to run inside a shadow root (documented below).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HTML = path.join(root, "tools", "spark-auth-tool.html");
const OUT = path.join(root, "snippets", "SparkAuthTool.jsx");

const src = fs.readFileSync(HTML, "utf8");

const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const bodyFull = src.match(/<body>([\s\S]*?)<script>/)[1];
const script = src.match(/<script>([\s\S]*?)<\/script>/)[1];

// Drop the tool's own page header (DevZone wordmark + back-link): redundant
// inside the docs, and there is no <head>/<html> in a shadow root.
const body = bodyFull
  .replace(/<!--\s*Header\s*-->/i, "")
  .replace(/<header class="hdr">[\s\S]*?<\/header>/, "")
  .trim();

// CSS transforms for shadow-root context:
//  - :root and body have no match inside a shadow tree, so move their rules to
//    :host (custom properties + base font/colour inherit into the shadow tree).
//  - the tool was sized to fill a standalone viewport; neutralise that so it
//    flows with the docs page instead.
const cssT =
  css.replace(/:root\{/, ":host{").replace(/\bbody\{/, ":host{") +
  "\n.page{min-height:0}\n";

// Script transforms:
//  - element lookups must target the shadow root instead of document; g() is
//    also made null-safe to absorb the tool's vestigial sidebar ids (they have
//    no markup, matching the original's harmless no-op).
//  - createElement / body / execCommand / clipboard stay on the real document.
const scriptT = script
  .replace(
    /function g\(id\)\{return document\.getElementById\(id\);\}/,
    'function g(id){return (window.__satRoot||document).getElementById(id)||{style:{},classList:{add:function(){},remove:function(){}},value:""};}'
  )
  .replace(/document\.querySelectorAll/g, "(window.__satRoot||document).querySelectorAll");

const out = `// AUTO-GENERATED from tools/spark-auth-tool.html by tools/generate-spark-auth-tool.mjs
// Do not edit by hand. To update, replace the .html and re-run the generator.
const CSS = ${JSON.stringify(cssT)};
const BODY = ${JSON.stringify(body)};
const SCRIPT = ${JSON.stringify(scriptT)};

export const SparkAuthTool = ({ legacy = false }) => {
  const mount = (host) => {
    if (!host || typeof window === "undefined") return;
    if (!host.shadowRoot) {
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = "<style>" + CSS + "</style>" + BODY;
      window.__satRoot = root;
      if (!window.__satLoaded) {
        window.__satLoaded = true;
        const s = document.createElement("script");
        s.textContent = SCRIPT;
        document.body.appendChild(s);
      }
    } else {
      window.__satRoot = host.shadowRoot;
    }
    if (legacy) {
      setTimeout(function () {
        try {
          const b = window.__satRoot.querySelector("#tab-auth .stabs .stab:last-child");
          if (window.showSub) window.showSub("auth", "leg", b);
        } catch (e) {}
      }, 0);
    }
  };
  return <div ref={mount} style={{ width: "100%" }} />;
};
`;

fs.writeFileSync(OUT, out);
console.log("Wrote " + OUT + " (" + out.length + " bytes)");
