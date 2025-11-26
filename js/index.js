// Imports
//Short Unique ID - CDN
import shortUniqueId from "https://cdn.jsdelivr.net/npm/short-unique-id@5.3.2/+esm";
import { logosArr } from "../js/data.js";

const uui = new shortUniqueId({ length: 5 });

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

// Global state
let formData = [];

const urlRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:(?:github|gitlab)\.com\/[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}|dev\.to\/[A-Za-z0-9_\-]+|codewars\.com\/users\/[A-Za-z0-9_\-]+|hashnode\.com\/@?[A-Za-z0-9_\-]+|youtube\.com\/(?:@|user\/|c\/)[A-Za-z0-9_\-]+|freecodecamp\.org\/(?:news\/author\/)?[A-Za-z0-9_\-]+|frontendmentor\.io\/(?:profile|users)\/[A-Za-z0-9_\-]+|facebook\.com\/(?:profile\.php\?id=\d+|[A-Za-z0-9\.\-_]+)|linkedin\.com\/in\/[A-Za-z0-9\-]+|(?:twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}|twitch\.tv\/[A-Za-z0-9_]{4,25})(?:\/.*)?$/i;

// Add Event Listeners
addLinkBtn.addEventListener("click", createNewLink);
formEl.addEventListener("submit", validateFormData);
userInfoForm.addEventListener("submit", validateUserInfo);
inputFileEl.addEventListener("change", loadPreviewImage);
userFirstName.addEventListener("input", function (e) {
  renderUserInfo(e.target.value, firstNameEl);
});
userLastName.addEventListener("input", function (e) {
  renderUserInfo(e.target.value, lastNameEl);
});
emailInput.addEventListener("input", function (e) {
  renderUserInfo(e.target.value, emailEl);
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
        platformName: "platformName",
        value: "github",
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

// Return a new template HTML with the data passed in
function generateLinkHTML(linkData, link) {
  const { id, inputData } = linkData;

  return `
    <div class="input-container">
      <div class="input-header">
        <div class="input-header-label">
          <img
            src="/assets/images/icon-drag-and-drop.svg"
            alt="dran and drop icon"
          />
          <span class="link-label">Link #${link}</span>
        </div>

        <button type="button" class="link-remove" data-id="${id}">Remove</button>
      </div>

      <div class="input-group">
        <label 
          for="${inputData.platform.platformName}-${id}" 
          class="input-label"
        >Platform</label>
        <div class="input-control">
          <span class="platform-logo platform-logo-container-${link}">
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
            ${logosArr.map(function (logo) {
              return `<option value="${
                logo.value
              }" ${logo.value === inputData.platform.value ? "selected" : ""}>${logo.name}</option>`;
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
function updateData(e) {
  formData.forEach((obj) => {
    if (obj.id === e.target.dataset.id) {
      if (e.target.name === `platformName-${obj.id}`) {
        obj.inputData.platform.value = e.target.value;
      } else {
        obj.inputData.link.value = e.target.value;
      }
    }
  });
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

// Remove phone links from the page
function cleanPhoneLinks() {
  const defaultLenth = 5;
  const phoneLinks = document.querySelectorAll(".link-item__default");

  for (let i = 0; i < phoneLinks.length; i++) {
    if (i < defaultLenth) {
      phoneLinks[i].parentElement.removeAttribute("data-id");
      phoneLinks[i].remove();
    } else {
      phoneLinks[i].parentElement.remove();
    }
  }
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

// Render a new link element into the DOM
function renderLinkHTML(link, length) {
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

  container.innerHTML = generateLinkHTML(link, length);
  formContainer.appendChild(container);

  // Add event listeners
  document
    .getElementById(`${link.inputData.platform.platformName}-${link.id}`)
    .addEventListener("change", function (e) {
      renderIcon(e.target.value, e.target.dataset.id);
      renderLinkUser(e.target.value, e.target.dataset.id);
      updateData(e);
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
  renderPhoneLink(length - 1, link.id, link.inputData.platform.value);
}

// Transfer the draggable element's data in JSON format
function dragStart(e) {
  const payload = {
    nodeId: this.dataset.id,
    dragData: {
      platformName: document.querySelector(
        `[data-id="${this.dataset.id}"] select`
      )?.value,
      link: document.querySelector(`[data-id="${this.dataset.id}"] input`)
        ?.value,
    },
  };

  this.classList.add("dragging");
  e.dataTransfer.setData("application/json", JSON.stringify(payload));
  e.dataTransfer.effectAllowed = "move";
}

// Remove the dragging class
function dragEnd() {
  this.classList.remove("dragging");
}

// Allow target elements for the drop event firing
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

// Swap data between the dragging item and drop target's item
function drop(e) {
  e.preventDefault();

  // Retrieve JSON from the dataTransferLists
  const raw = e.dataTransfer.getData("application/json");
  if (!raw) return;

  const { nodeId, dragData } = JSON.parse(raw);
  if (this.dataset.id === nodeId) return;

  const currentSelectEL = document.querySelector(
    `[data-id="${this.dataset.id}"] select`
  );
  const currentInputEl = document.querySelector(
    `[data-id="${this.dataset.id}"] input`
  );

  const sourceSelectEl = document.querySelector(`[data-id="${nodeId}"] select`);
  const sourceInputEl = document.querySelector(`[data-id="${nodeId}"] input`);

  sourceSelectEl.value = currentSelectEL.value;
  sourceInputEl.value = currentInputEl.value;
  renderIcon(currentSelectEL.value, sourceSelectEl.dataset.id);
  renderLinkUser(currentSelectEL.value, sourceSelectEl.dataset.id);

  currentSelectEL.value = dragData.platformName;
  currentInputEl.value = dragData.link;
  renderIcon(dragData.platformName, currentSelectEL.dataset.id);
  renderLinkUser(dragData.platformName, currentSelectEL.dataset.id);

  // Update state
  swapFormData(nodeId, this.dataset.id);
}

// Swap data in the state array
function swapFormData(sourceId, targetId) {
  let i = null;
  let j = null;

  formData.forEach((obj, index) => {
    if (obj.id === sourceId) {
      i = index;
    } else if (obj.id === targetId) {
      j = index;
    }
  });

  const sourcePLatform = formData[i].inputData.platform.value;
  const linkPlatform = formData[i].inputData.link.value;

  formData[i].inputData.platform.value = formData[j].inputData.platform.value;
  formData[i].inputData.link.value = formData[j].inputData.link.value;

  formData[j].inputData.platform.value = sourcePLatform;
  formData[j].inputData.link.value = linkPlatform;
}

// Render the matched icon based on the selecting dropdown
function renderIcon(iconName, idLink) {
  document.querySelector(
    `[data-id="${idLink}"] .platform-logo`
  ).innerHTML = `<img src="/assets/images/icon-${iconName}.svg" alt="${iconName} icon">`;
}

// Render links on the mockup phone
function renderPhoneLink(index, id, platformName) {
  const getData = getPlatformName(platformName);

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

// Get platform name's data
function getPlatformName(name) {
  return logosArr
    .filter(function (link) {
      return link.value === name;
    })
    .at(0);
}

function renderLinkUser(value, dataid) {
  const link = document.querySelector(
    `[data-id="${dataid}"] .link-item__default`
  );

  const linkData = getPlatformName(value);

  // Remove previous classes
  removeLinksClass(link);

  link.classList.add(linkData.className);
  link.children[0].src = linkData.path;
  link.children[1].textContent = linkData.name;
}

// Remove the last link-item class
function removeLinksClass(elRef) {
  const classString = elRef.classList[1];
  if (classString) {
    elRef.classList.remove(classString);
  }
}

// Validate user's entered data either is empty
// or does not match the correct URL pattern
function validateFormData(e) {
  // Reference all input elements with the given class name
  const linkInputs = document.getElementsByClassName("input-el");
  const errorMessage = {
    empty: "Can't be empty",
    url: "Please check the URL",
  };

  // If no inputs yet, return anything
  if (linkInputs.length === 0) {
    return;
  }

  // Loop over each input in the linkInputs array
  // and validate if each matches the required data
  for (let i = 0; i < linkInputs.length; i++) {
    const errorMessageEL = document.querySelector(`.error-message-${i + 1}`);

    const currentEl = linkInputs[i];
    // Check whether the input is empty or does
    // not match the given url against the regex pattern
    if (currentEl.value.length === 0) {
      createErrorMessageEl(i, errorMessage.empty, currentEl, errorMessageEL);
      currentEl.classList.add("form-control__invalid");
    } else if (!urlRegex.test(currentEl.value)) {
      createErrorMessageEl(i, errorMessage.url, currentEl, errorMessageEL);
      currentEl.classList.add("form-control__invalid");
    } else if (errorMessageEL) {
      errorMessageEL.parentElement.removeChild(errorMessageEL);
      currentEl.classList.remove("form-control__invalid");
    }
  }

  e.preventDefault();
}

// Create and render an error message element into the DOM
function createErrorMessageEl(i, message, nodeEl, messageEl) {
  // Remove child element if it already exists in the DOM
  if (messageEl) {
    messageEl.parentElement.removeChild(messageEl);
  }

  const span = document.createElement("span");
  span.classList.add("form-error-message", `error-message-${i + 1}`);
  span.textContent = message;

  nodeEl.parentElement.parentElement.appendChild(span);
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
}

function renderUserInfo(text, element) {
  element.textContent = text;
  let toggleClasses = false;

  switch (element.classList[0]) {
    case "first-name":
    case "last-name":
      if (firstNameEl.textContent || lastNameEl.textContent) {
        toggleClasses = true;
      } else {
        toggleClasses = false;
      }
      break;
    case "preview-email":
      if (emailEl.textContent) {
        toggleClasses = true;
      } else {
        toggleClasses = false;
      }
      break;
    default:
      return;
  }

  if (toggleClasses) {
    element.parentElement.classList.remove("shape__default");
    element.parentElement.classList.add("shape__active");
  } else {
    element.parentElement.classList.remove("shape__active");
    element.parentElement.classList.add("shape__default");
  }
}

function validateUserInfo(e) {
  for (let i = 0; i < userInfoInputs.length; i++) {
    const errorMessageEL = document.querySelector(
      `.input-group-2 .error-message-${i + 1}`
    );

    if (userInfoInputs[i].value.length === 0) {
      createErrorMessageEl(
        i,
        "Cant't be empty",
        userInfoInputs[i],
        errorMessageEL
      );
      userInfoInputs[i].classList.add("form-control__invalid");
    } else if (errorMessageEL) {
      errorMessageEL.parentElement.removeChild(errorMessageEL);
      userInfoInputs[i].classList.remove("form-control__invalid");
    }
  }

  e.preventDefault();
}
