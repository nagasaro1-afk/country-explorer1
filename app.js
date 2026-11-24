const API = "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,languages,currencies";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => "&#" + ch.charCodeAt(0) + ";");
const names = (o) => (o ? Object.values(o).map((x) => x.name || x).join(", ") : "N/A");
let countries = [];

async function load() {
  $("status").textContent = "Loading countries...";
  $("retry").hidden = true;
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("API status " + res.status);
    countries = await res.json();
    if (!Array.isArray(countries)) throw new Error("Bad response");
    render();
  } catch (e) {
    $("status").textContent = `Could not load data (${e.message}). Check your connection and retry.`;
    $("retry").hidden = false;
  }
}

function render() {
  const term = $("search").value.trim().toLowerCase();
  const region = $("region").value;
  const [key, dir] = $("sort").value.split("-");
  const list = countries
    .filter((c) => c.name.common.toLowerCase().includes(term) && (!region || c.region === region))
    .sort((a, b) => (key === "name" ? a.name.common.localeCompare(b.name.common) : a.population - b.population) * (dir === "asc" ? 1 : -1));
  $("count").textContent = list.length + " countries found";
  $("status").textContent = list.length ? "" : "No countries match your search.";
  $("results").innerHTML = list.map(card).join("");
}

const card = (c) => `<div class="card">
  <img src="${esc(c.flags?.png || "")}" alt="Flag of ${esc(c.name.common)}">
  <h3>${esc(c.name.common)}</h3>
  <p><b>Capital:</b> ${esc(c.capital?.join(", ") || "N/A")}</p>
  <p><b>Region:</b> ${esc(c.region || "N/A")}</p>
  <p><b>Population:</b> ${c.population.toLocaleString()}</p>
  <p><b>Languages:</b> ${esc(names(c.languages))}</p>
  <p><b>Currency:</b> ${esc(names(c.currencies))}</p></div>`;

["search", "region", "sort"].forEach((id) => $(id).addEventListener("input", render));
$("retry").onclick = load;
load();
