// --- Read More / Read Less ---
const readToggle = document.getElementById("readToggle");
const moreBlock = document.getElementById("moreBlock");

readToggle.addEventListener("click", () => {
  const isHidden = moreBlock.hasAttribute("hidden");

  if (isHidden) {
    moreBlock.removeAttribute("hidden");
    readToggle.textContent = "Read Less";
  } else {
    moreBlock.setAttribute("hidden", "");
    readToggle.textContent = "Read More";
  }
});

// --- Tabs filter ---
const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");

function setActiveTab(filter) {
  tabs.forEach(t => t.classList.toggle("active", t.dataset.filter === filter));

  cards.forEach(card => {
    const cat = card.dataset.category;
    card.hidden = (cat !== filter);
  });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.filter));
});

// Default to Research
setActiveTab("research");


// ---- Card click -> post page ----
document.querySelectorAll(".card").forEach((card) => {
  card.style.cursor = "pointer";
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "link");

  const go = () => {
    const slug = card.dataset.slug;
    if (!slug) {
      alert("This card has no data-slug yet.");
      return;
    }
    window.location.href = `post.html?slug=${encodeURIComponent(slug)}`;
  };

  card.addEventListener("click", go);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go();
  });
});

console.log("✅ script.js loaded and card clicks are wired");
