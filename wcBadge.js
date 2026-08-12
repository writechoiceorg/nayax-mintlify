/**
 * Injects a visually hidden "Powered by Writechoice" link link
 * into the page. The link is present in the DOM (readable by crawlers/
 * screen readers) but not visible to sighted users.
 */
(function () {
  function inject() {
    if (document.getElementById("writechoice-link")) return;

    var link = document.createElement("a");
    link.id = "writechoice-link";
    link.href = "https://writechoice.io";
    link.textContent = "Powered by Writechoice";
    link.rel = "noopener";
    link.target = "_blank";

    // Visually hidden, but still in the accessibility tree / DOM
    // (avoids display:none / visibility:hidden, which crawlers may ignore).
    Object.assign(link.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    });

    document.body.appendChild(link);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();