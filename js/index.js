// Imports
//Short Unique ID - CDN
import shortUniqueId from "https://cdn.jsdelivr.net/npm/short-unique-id@5.3.2/+esm";
import { dragStart, dragEnd, dragOver, drop } from "./dragAndDrop.js";
import { getPlatformData } from "../utils/getPlatformData.js";
import { renderIcon, renderLinkPreview } from "./renderSocialMediaData.js";
import { validateFormData, validateUserInfo } from "./formValidation.js";
import { logosArr } from "../data/data.js";

// VARIABLES
const addLinkBtn = document.getElementById("add-link");
const formContainer = document.querySelector(".form-container");
const saveBtn = document.getElementById("save");
const addLinkEmpty = document.querySelector(".add-link-empty");
const listsLinks = document.getElementsByClassName("link-item");
const linksContainer = document.querySelector(".links-lists");
const formEl = document.querySelector(".form-add-link");
const inputFileEl = document.getElementById("uploadAvatar");
const loadAvatarEL = document.querySelector(".user-upload-avatar");
const uploadImageHintEl = document.querySelector(".upload-image");
const avatarShape = document.querySelector(".profile-picture");
const userFirstName = document.getElementById("firstName");
const userLastName = document.getElementById("lastName");
const firstNameEl = document.querySelector(".first-name");
const lastNameEl = document.querySelector(".last-name");
const emailEl = document.querySelector(".preview-email");
const emailInput = document.getElementById("email");
const tabsBtn = document.getElementsByClassName("tab");
const linkSection = document.querySelector(".app-links");
const profileSection = document.querySelector(".app-profile");
const userInfoForm = document.querySelector(".profile-form");
const userInfoInputs = document.querySelectorAll(".input-group-2 input");

// Generate a short Id
const uui = new shortUniqueId({ length: 5 });

// Global state
export let formData = [];

const urlRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:(?:github|gitlab)\.com\/[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}|dev\.to\/[A-Za-z0-9_\-]+|codewars\.com\/users\/[A-Za-z0-9_\-]+|hashnode\.com\/@?[A-Za-z0-9_\-]+|youtube\.com\/(?:@|user\/|c\/)[A-Za-z0-9_\-]+|freecodecamp\.org\/(?:news\/author\/)?[A-Za-z0-9_\-]+|frontendmentor\.io\/(?:profile|users)\/[A-Za-z0-9_\-]+|facebook\.com\/(?:profile\.php\?id=\d+|[A-Za-z0-9\.\-_]+)|linkedin\.com\/in\/[A-Za-z0-9\-]+|(?:twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}|twitch\.tv\/[A-Za-z0-9_]{4,25})(?:\/.*)?$/i;

// Add Event Listeners
addLinkBtn.addEventListener("click", createNewLink);
formEl.addEventListener("submit", function (e) {
  validateFormData(e, urlRegex);
});
userInfoForm.addEventListener("submit", function (e) {
  validateUserInfo(e, userInfoInputs, inputFileEl);
});
inputFileEl.addEventListener("change", loadPreviewImage);
userFirstName.addEventListener("input", function (e) {
  renderUserInfo(e.target, firstNameEl);
});
userLastName.addEventListener("input", function (e) {
  renderUserInfo(e.target, lastNameEl);
});
emailInput.addEventListener("input", function (e) {
  renderUserInfo(e.target, emailEl);
});
tabsBtn[0].addEventListener("click", function () {
  profileSection.classList.remove("display-block");
  linkSection.classList.remove("display-none");
  linkSection.classList.add("display-block");

  tabsBtn[1].classList.remove("tab-active");
  tabsBtn[0].classList.add("tab-active");
});
tabsBtn[1].addEventListener("click", function () {
  linkSection.classList.remove("display-block");
  profileSection.classList.remove("display-none");
  profileSection.classList.add("display-block");

  tabsBtn[0].classList.remove("tab-active");
  tabsBtn[1].classList.add("tab-active");
});

// Store data into the current state(array)
function createNewLink() {
  // Generate an ID for each instance
  const dataId = uui.rnd();

  // Object Template
  const dataObj = {
    id: dataId,
    inputData: {
      platform: {
        uuid: logosArr.at(0).uuid,
        platformName: "platformName",
        value: logosArr.at(0).value,
      },
      link: {
        linkName: "linkURL",
        value: "",
      },
    },
  };

  // ADD new Obj
  formData.push(dataObj);

  // Render LINK
  renderLinkHTML(dataObj, formData.length);
}

// Render a new link element into the DOM
function renderLinkHTML(link, count) {
  // Hide default UI state
  if (saveBtn.disabled) {
    addLinkEmpty.style.display = "none";
    saveBtn.disabled = false;
  }

  // Generate HTML
  const container = document.createElement("div");
  container.classList.add("draggable");
  container.dataset.id = link.id;
  container.draggable = true;

  container.innerHTML = generateLinkHTML(link, count);
  formContainer.appendChild(container);

  // Add event listeners
  document
    .getElementById(`${link.inputData.platform.platformName}-${link.id}`)
    .addEventListener("change", function (e) {
      renderIcon(e.target.value, e.target.dataset.id);
      const uuid = renderLinkPreview(e.target.value, e.target.dataset.id);

      // Update State
      updateData(e, uuid);
    });

  document
    .getElementById(`${link.inputData.link.linkName}-${link.id}`)
    .addEventListener("input", updateData);

  document
    .querySelector(`[data-id="${link.id}"] .link-remove`)
    .addEventListener("click", deleteLink);

  // Drag an Drop events
  container.addEventListener("dragstart", dragStart);
  container.addEventListener("dragend", dragEnd);
  container.addEventListener("dragover", dragOver);
  container.addEventListener("drop", drop);

  // // Display link to the mockup phone
  renderPhoneLink(count - 1, link.id, link.inputData.platform.value);
}

// Return a new template HTML with the data passed in
function generateLinkHTML(linkData, count) {
  const { id, inputData } = linkData;

  return `
    <div class="input-container">
      <div class="input-header">
        <div class="input-header-label">
          <img
            src="/assets/images/icon-drag-and-drop.svg"
            alt="dran and drop icon"
          />
          <span class="link-label">Link #${count}</span>
        </div>

        <button type="button" class="link-remove" data-id="${id}">Remove</button>
      </div>

      <div class="input-group">
        <label 
          for="${inputData.platform.platformName}-${id}" 
          class="input-label"
        >Platform</label>
        <div class="input-control">
          <span class="platform-logo platform-logo-container-${count}">
            <img
                src="/assets/images/icon-${inputData.platform.value}.svg"
                alt="icon of codepen platform"
            />
          </span>
          <select 
            name="${inputData.platform.platformName}-${id}" 
            id="${inputData.platform.platformName}-${id}"
            data-id="${id}"
          > 
            ${logosArr.map((logo) => {
              return `<option value="${logo.value}" ${
                logo.value === inputData.platform.value ? "selected" : ""
              }>${logo.name}</option>`;
            })}
          </select>

          <img src="/assets/images/arrow-down.svg" alt="arrow down icon" class="select-arrow-icon" >
        </div>
      </div>

      <div class="input-group">
        <label 
          for="${inputData.link.linkName}-${id}" 
          class="input-label"
          >Link</label>
        <div class="input-info-wrapper">
          <div class="input-control">
              <span class="platform-logo">
                <img src="/assets/images/icon-link.svg" alt="" />
              </span>
              <input
                type="text"
                name="${inputData.link.linkName}-${id}"
                id="${inputData.link.linkName}-${id}"
                class="input-el"
                placeholder="e.g. https://www.github.com/macin-dev"
                data-id="${id}"
                value="${inputData.link.value}"
              />
          </div>
        </div>
      </div>
    </div
    `;
}

// Update current state
function updateData(e, uuid) {
  formData.forEach((obj) => {
    if (obj.id === e.target.dataset.id) {
      if (e.target.name === `platformName-${obj.id}`) {
        obj.inputData.platform.value = e.target.value;
        obj.inputData.platform.uuid = uuid;
      } else {
        obj.inputData.link.value = e.target.value;
      }
    }
  });
}

// Remove link from the array and DOM
function deleteLink(e) {
  // Remove link from the DOM
  const link = e.target.parentElement.parentElement.parentElement;

  // Update state
  const updatedData = formData.filter((obj) => obj.id !== e.target.dataset.id);
  formData = updatedData;

  // Clean phone link
  cleanPhoneLinks();

  // Remove link
  link.remove();

  // Render HTML
  renderUpdatedLinks();
}

// Remove phone links from the page
function cleanPhoneLinks() {
  const defaultLength = 5;
  const phoneLinks = document.querySelectorAll(".link-item__default");

  for (let i = 0; i < phoneLinks.length; i++) {
    if (i < defaultLength) {
      phoneLinks[i].parentElement.removeAttribute("data-id");
      phoneLinks[i].remove();
    } else {
      phoneLinks[i].parentElement.remove();
    }
  }
}

// Render updated links
function renderUpdatedLinks() {
  // Clean previous HTML
  while (formContainer.lastChild) {
    formContainer.removeChild(formContainer.lastChild);
  }

  if (formData.length === 0) {
    addLinkEmpty.style.display = "block";
    saveBtn.disabled = true;
    return;
  }

  // Render out links
  formData.forEach((link, i) => {
    renderLinkHTML(link, i + 1);
  });
}

// Render links on the mockup phone
function renderPhoneLink(index, id, platformName) {
  const getData = getPlatformData(logosArr, platformName);

  const templateHTML = `
  <div class="link-item__default ${getData.className}">
    <img src="${getData.path}" alt="${getData.name} icon">
    <span class="link-item-name">${getData.name}</span>
    <img src="/assets/images/icon-arrow-right.svg" alt="arrow right icon" class="link-arrow-right">
  </div>
  `;

  if (index < listsLinks.length) {
    listsLinks[index].innerHTML = templateHTML;
    listsLinks[index].dataset.id = id;
  } else {
    const liEl = document.createElement("li");
    liEl.classList.add("link-item");
    liEl.dataset.id = id;
    liEl.innerHTML = templateHTML;

    linksContainer.appendChild(liEl);
  }
}

// USER DETAILS
// Render user's photo
function loadPreviewImage() {
  const fetchImgUrl = URL.createObjectURL(inputFileEl.files[0]);
  loadAvatarEL.classList.add("load-bg-image");
  loadAvatarEL.style.backgroundImage = `url(${fetchImgUrl})`;
  uploadImageHintEl.style.color = "#fff";

  // Load image within the mockup phone
  avatarShape.innerHTML = `<img src="${fetchImgUrl}" alt="user's avatar" >`;
  avatarShape.classList.add("profile-pircture__active");
}

function renderUserInfo(currentNode, targetNode) {
  let styling = false;

  if (
    (userFirstName.value && currentNode.name !== "email") ||
    (userLastName.value && currentNode.name !== "email")
  ) {
    targetNode.textContent = currentNode.value;
    styling = true;
  } else if (emailInput.value && currentNode.name === "email") {
    targetNode.textContent = currentNode.value;
    styling = true;
  }

  if (styling) {
    targetNode.parentElement.classList.remove("shape__default");
    targetNode.parentElement.classList.add("shape__active");
  } else {
    targetNode.parentElement.classList.add("shape__default");
    targetNode.parentElement.classList.remove("shape__active");
    targetNode.textContent = "";
  }
}
