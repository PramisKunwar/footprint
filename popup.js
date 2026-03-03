// popup.js — Communicates with content.js and displays results

// When the popup opens, ask the content script for page size
document.addEventListener("DOMContentLoaded", () => {
  // Get the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (!tab || !tab.id) {
      showError("Cannot access this page.");
      return;
    }

    // Send a message to the content script running on that tab
    chrome.tabs.sendMessage(tab.id, { action: "getPageSize" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // Content script might not be injected (e.g., chrome:// pages)
        showError("Cannot analyze this page.");
        return;
      }

      // Calculate CO₂ using the formula: 1 MB ≈ 0.2g CO₂
      const pageSizeMB = response.pageSizeMB;
      const co2Grams = pageSizeMB * 0.2;

      // Display results rounded to 2 decimal places
      document.getElementById("pageSize").textContent = pageSizeMB.toFixed(2) + " MB";
      document.getElementById("co2").textContent = co2Grams.toFixed(2) + " g";

      // Show color-coded impact indicator
      showImpact(co2Grams);
    });
  });
});

/**
 * Show a color-coded impact message based on CO₂ amount
 */
function showImpact(co2) {
  const el = document.getElementById("impact");

  if (co2 < 0.1) {
    el.className = "impact low";
    el.textContent = "Low impact page 🌿";
  } else if (co2 <= 0.5) {
    el.className = "impact medium";
    el.textContent = "Moderate impact page 🌤️";
  } else {
    el.className = "impact high";
    el.textContent = "Heavy page ⚠️";
  }
}

/**
 * Show an error message when the page can't be analyzed
 */
function showError(message) {
  document.getElementById("pageSize").textContent = "N/A";
  document.getElementById("co2").textContent = "N/A";
  const el = document.getElementById("impact");
  el.className = "impact medium";
  el.textContent = message;
}