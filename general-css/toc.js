// general-css/toc.js
document.addEventListener("DOMContentLoaded", function() {
  // --- Make meta tags collapsible ---
  const metaTags = document.querySelector(".meta dl.tags");
  if (metaTags) {
    const details = document.createElement("details");
    details.className = "meta-details";
    // Optional: open by default on desktop, closed on mobile
    if (window.innerWidth > 768) {
      details.open = true;
    }
    
    const summary = document.createElement("summary");
    summary.innerText = "Story Information";
    
    metaTags.parentNode.insertBefore(details, metaTags);
    details.appendChild(summary);
    details.appendChild(metaTags);
  }

  // --- TOC Generation ---
  const headings = document.querySelectorAll("#chapters .heading");
  if (headings.length === 0) return;

  const toc = document.createElement("div");
  toc.id = "toc-sidebar";
  
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "toc-toggle-btn";
  
  const tocContent = document.createElement("div");
  tocContent.className = "toc-content";
  
  const tocTitle = document.createElement("h3");
  tocTitle.innerText = "Index"; // Changed to English for publication feel
  tocContent.appendChild(tocTitle);

  const ul = document.createElement("ul");

  headings.forEach((heading, index) => {
    const id = heading.id || `chapter-${index + 1}`;
    heading.id = id;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    
    // Clean up "Chapter X: " from the text if it exists
    let text = heading.innerText.trim();
    text = text.replace(/^Chapter\s+\d+:\s*/i, '');
    
    a.innerText = text;
    li.appendChild(a);
    ul.appendChild(li);
  });

  tocContent.appendChild(ul);
  toc.appendChild(toggleBtn);
  toc.appendChild(tocContent);
  document.body.appendChild(toc);

  const isMobile = window.innerWidth <= 1024;
  if (isMobile) {
    document.body.classList.add("toc-closed");
  }

  function updateBtnIcon() {
    const isClosed = document.body.classList.contains("toc-closed");
    if (window.innerWidth <= 1024 && !isClosed) {
      toggleBtn.innerHTML = "✕"; // Close icon when open on mobile
    } else {
      // Use text/symbols that look like print marks
      toggleBtn.innerHTML = isClosed ? "«" : "»";
    }
  }
  
  updateBtnIcon();

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("toc-closed");
    updateBtnIcon();
  });
  
  window.addEventListener("resize", () => {
    updateBtnIcon();
  });

  // Close TOC on mobile when clicking a link
  toc.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        document.body.classList.add("toc-closed");
        updateBtnIcon();
      }
    });
  });

  // Highlight active chapter
  window.addEventListener("scroll", () => {
    let current = "";
    headings.forEach(heading => {
      const headingTop = heading.getBoundingClientRect().top;
      if (headingTop < 150) { 
        current = heading.id;
      }
    });

    document.querySelectorAll("#toc-sidebar a").forEach(a => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) {
        a.classList.add("active");
      }
    });
  });
});
