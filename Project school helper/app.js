const starterResources = [
  { title: "Cellular respiration in one page", subject: "Science", type: "Study note", time: "8 min read", description: "A visual guide to glycolysis, the Krebs cycle, and the electron transport chain.", preview: "Follow glucose from its first split to the final ATP payoff." },
  { title: "Quadratic equations, made less scary", subject: "Math", type: "Quick guide", time: "12 min read", description: "The patterns, formulas, and small checks that make quadratics click.", preview: "Start with the shape: factor, complete the square, or use the formula." },
  { title: "The parts of a strong essay", subject: "English", type: "Reviewer", time: "10 min read", description: "A practical checklist for making an argument clear and convincing.", preview: "Claim, evidence, explanation: the three beats every paragraph needs." },
  { title: "Layers of the atmosphere", subject: "Science", type: "Study note", time: "6 min read", description: "Temperature, altitude, and the five layers above our heads.", preview: "Troposphere to exosphere, with the clues that help you remember the order." },
  { title: "World War II timeline", subject: "Social studies", type: "Reviewer", time: "15 min read", description: "The key turning points, alliances, and dates in one clean timeline.", preview: "A date is easier to hold onto when you know what changed because of it." },
  { title: "Functions and their graphs", subject: "Math", type: "Quick guide", time: "9 min read", description: "See how equations become shapes, shifts, and useful predictions.", preview: "Input goes in, output comes out: the graph shows the relationship." }
];

const savedResources = JSON.parse(localStorage.getItem("study-shelf-resources") || "[]");
let resources = [...savedResources, ...starterResources];
let activeSubject = "All";

const resourceGrid = document.querySelector("#resource-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const resourceCount = document.querySelector("#resource-count");
const resourceDialog = document.querySelector("#resource-dialog");
const uploadDialog = document.querySelector("#upload-dialog");

function renderResources() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleResources = resources.filter((resource) => {
    const matchesSubject = activeSubject === "All" || resource.subject === activeSubject;
    const searchableText = `${resource.title} ${resource.subject} ${resource.type} ${resource.description}`.toLowerCase();
    return matchesSubject && searchableText.includes(query);
  });

  resourceGrid.innerHTML = visibleResources.map((resource, index) => `
    <article class="resource-card" style="animation-delay: ${index * 60}ms">
      <div class="card-meta"><span>${resource.type}</span><span>${resource.time}</span></div>
      <h3>${resource.title}</h3>
      <p>${resource.description}${resource.fileName ? ` <span class="file-name">${resource.fileName}</span>` : ""}</p>
      <button class="text-button preview-trigger" type="button" data-resource="${resource.title}">View resource <span aria-hidden="true">↗</span></button>
    </article>
  `).join("");

  emptyState.hidden = visibleResources.length > 0;
  resourceCount.textContent = String(resources.length).padStart(2, "0");
}

function openResource(title) {
  const resource = resources.find((item) => item.title === title);
  if (!resource) return;
  document.querySelector("#dialog-type").firstChild.textContent = resource.type.toUpperCase() + " ";
  document.querySelector("#dialog-title").textContent = resource.title;
  document.querySelector("#dialog-description").textContent = resource.description;
  document.querySelector("#dialog-subject").textContent = resource.subject;
  document.querySelector("#dialog-time").textContent = resource.time;
  document.querySelector("#dialog-preview").textContent = resource.preview;
  resourceDialog.showModal();
}

document.querySelector("#subject-filters").addEventListener("click", (event) => {
  const filter = event.target.closest("[data-subject]");
  if (!filter) return;
  activeSubject = filter.dataset.subject;
  document.querySelectorAll(".filter").forEach((button) => button.classList.toggle("active", button === filter));
  renderResources();
});

searchInput.addEventListener("input", renderResources);
resourceGrid.addEventListener("click", (event) => {
  const trigger = event.target.closest(".preview-trigger");
  if (trigger) openResource(trigger.dataset.resource);
});
document.querySelectorAll(".preview-trigger").forEach((trigger) => trigger.addEventListener("click", () => openResource(trigger.dataset.resource)));

document.querySelector("#open-upload").addEventListener("click", () => uploadDialog.showModal());
document.querySelector("#close-upload").addEventListener("click", () => uploadDialog.close());
document.querySelector("#close-resource").addEventListener("click", () => resourceDialog.close());
document.querySelector("#close-resource-bottom").addEventListener("click", () => resourceDialog.close());

document.querySelector("#upload-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const file = formData.get("file");
  const newResource = {
    title: formData.get("title"),
    subject: formData.get("subject"),
    type: formData.get("type"),
    time: "Just added",
    description: formData.get("description"),
    fileName: file.name,
    preview: `Attached file: ${file.name}`
  };
  resources.unshift(newResource);
  localStorage.setItem("study-shelf-resources", JSON.stringify(resources.filter((resource) => resource.fileName)));
  event.currentTarget.reset();
  uploadDialog.close();
  activeSubject = "All";
  document.querySelectorAll(".filter").forEach((button) => button.classList.toggle("active", button.dataset.subject === "All"));
  renderResources();
  document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
});

renderResources();