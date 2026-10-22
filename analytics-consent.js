(() => {
  "use strict";
  const id = "G-4C2GY0FLBB";
  const key = "studysprint.analytics.v1";
  const banner = document.querySelector("#analytics-choice");
  let loaded = false;
  function savedChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved && Date.now() - saved.time < 180 * 86400000 ? saved.value : null;
    } catch { return null; }
  }
  function remember(value) {
    try { localStorage.setItem(key, JSON.stringify({value, time: Date.now()})); } catch {}
  }
  function startAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: location.hostname, cookie_path: "/studysprint/",
      cookie_expires: 180 * 86400
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.append(script);
  }
  function refuse() {
    remember("denied");
    window["ga-disable-" + id] = true;
    document.cookie.split(";").forEach(part => {
      const name = part.split("=")[0].trim();
      if (name === "_ga" || name.startsWith("_ga_")) {
        for (const path of ["/studysprint/", "/"]) {
          for (const domain of ["", "; domain=" + location.hostname, "; domain=." + location.hostname]) {
            document.cookie = name + "=; Max-Age=0; path=" + path + domain + "; SameSite=Lax; Secure";
          }
        }
      }
    });
    banner.hidden = true;
    if (loaded) location.reload();
  }
  document.querySelector("#analytics-accept").addEventListener("click", () => {
    remember("granted");
    banner.hidden = true;
    startAnalytics();
  });
  document.querySelector("#analytics-refuse").addEventListener("click", refuse);
  document.querySelector("#analytics-settings").addEventListener("click", () => {
    banner.hidden = false;
    document.querySelector("#analytics-refuse").focus();
  });
  if (savedChoice() === "granted") startAnalytics();
  else if (savedChoice() !== "denied") banner.hidden = false;
})();