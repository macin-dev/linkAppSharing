// Import statements
import { getLinkDataById } from "../utils/getLinkDataById.js";

// Global variables
const messageEl = document.querySelector(".default-message");
const linksContainerEl = document.querySelector(".preview-link-container");
const ulContainer = document.querySelector(".lists-links__preview");
const userInfoContainer = document.querySelector(".profile-preview");

// Parse the data coming from the localStorage
function parseLocalStorageData(label) {
  const isRaw = localStorage.getItem(label);
  if (!isRaw) {
    return;
  }

  return JSON.parse(isRaw);
}

// Render each link with the appropiate data
function renderLinksHTML(arr) {
  let html = "";

  arr.forEach((link) => {
    // Filter links by Id - it returns an object
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

// Render user's information
function renderUserInfoHTML(obj) {
  userInfoContainer.innerHTML = `
    <h2 class="profile-name__preview">${obj.firstName} ${obj.lastName}</h2>
    <span class="profile-email__preview">${obj.email}</span>
  `;
}

// Add Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const isLinks = parseLocalStorageData("devlinks");
  const userInfo = parseLocalStorageData("devlinks-profile");

  if (!isLinks || !userInfo) {
    return;
  }

  renderLinksHTML(isLinks);
  renderUserInfoHTML(userInfo);
});
