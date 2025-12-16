import { getLinkDataById } from "../utils/getLinkDataById.js";

const messageEl = document.querySelector(".default-message");
const linksContainerEl = document.querySelector(".preview-link-container");
const ulContainer = document.querySelector(".lists-links__preview");

function parseJsonFromLocalStorage() {
  const isRaw = localStorage.getItem("devlinks");
  if (!isRaw) {
    return;
  }

  return JSON.parse(isRaw);
}

function renderHTML(arr) {
  let html = "";

  arr.forEach((link) => {
    const linkObj = getLinkDataById(link.inputData.platform.uuid);

    html += `
        <li class="link-item__preview">
            <a href="${link.inputData.link.value}" target="_blank" class="${linkObj.className}">
            <img
                src="/assets/images/icon-${linkObj.value}-white.svg"
                alt="${linkObj.name} icon"
            />
            <span class="link-item-name">${linkObj.name}</span>
            <img
                src="/assets/images/icon-arrow-right.svg"
                alt="arrow right icon"
                class="link-arrow-right"
            />
            </a>
        </li>
    `;
  });

  messageEl.style.display = "none";
  linksContainerEl.style.display = "block";
  ulContainer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const isData = parseJsonFromLocalStorage();
  if (!isData) {
    return;
  }

  renderHTML(isData);
});
