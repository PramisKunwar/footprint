// content.js — Runs on every webpage to estimate page size

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageSize") {
    // Ensure we respond even if calculation fails
    try {
      const pageSizeMB = calculatePageSize();
      sendResponse({ pageSizeMB: pageSizeMB, success: true });
    } catch (error) {
      console.error("Error calculating page size:", error);
      sendResponse({ 
        pageSizeMB: 0, 
        success: false, 
        error: error.message 
      });
    }
  }
  return true; // Keep the message channel open for async response
});

function calculatePageSize() {
  let totalBytes = 0;

  try {
    // Wait a bit for Performance API to populate (if needed)
    // Get all resource entries (scripts, images, stylesheets, etc.)
    const resources = performance.getEntriesByType("resource");

    if (resources.length > 0) {
      for (const resource of resources) {
        // transferSize is the actual bytes transferred over the network
        if (resource.transferSize > 0) {
          totalBytes += resource.transferSize;
        } else if (resource.encodedBodySize > 0) {
          // Fallback: use encodedBodySize (compressed size)
          totalBytes += resource.encodedBodySize;
        }
        // Some resources might have 0 for both if from cache
      }
    }

    // Also add the main document size
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
      const nav = navEntries[0];
      if (nav.transferSize > 0) {
        totalBytes += nav.transferSize;
      } else if (nav.encodedBodySize > 0) {
        totalBytes += nav.encodedBodySize;
      }
    }

    // If we got data but it seems incomplete, add a note (can't modify response here)
    if (totalBytes === 0 && resources.length > 0) {
      console.log("Resources found but size data unavailable (possibly cached)");
    }
  } catch (e) {
    console.warn("Performance API failed, using fallback:", e);
  }

  // Fallback: if we couldn't get resource sizes, estimate from HTML
  if (totalBytes === 0) {
    // Better byte calculation for UTF-16 (what JS uses internally)
    const html = document.documentElement.innerHTML;
    totalBytes = getStringByteSize(html);
  }

  // Convert bytes to megabytes
  const sizeMB = totalBytes / (1024 * 1024);
  return sizeMB;
}

function getStringByteSize(str) {

  return str.length * 2;
}