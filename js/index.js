// Imports
import { logosArr } from "../js/data.js";

// VARIABLES
const addLinkBtn = document.getElementById("add-link");
const formContainer = document.querySelector(".form-container");
const saveBtn = document.getElementById("save");
const addLinkEmpty = document.querySelector(".add-link-empty");
const linkShapes = document.getElementsByClassName("link-item-container");
const linksContainer = document.querySelector(".links-lists");
const formEl = document.querySelector(".form-add-link");
const inputFileEl = document.getElementById("uploadAvatar");
const loadAvatarEL = document.querySelector(".user-upload-avatar");
const uploadImageHintEl = document.querySelector(".upload-image");
const avatarShape = document.querySelector(".profile-picture");
const userFirstName = document.getElementById("firstName");
const userLastName = document.getElementById("lastName");
const userNameShape = document.querySelector(".profile-username");
const firstNameEl = document.querySelector(".first-name");
const lastNameEl = document.querySelector(".last-name");
const emailEl = document.querySelector(".preview-email");
const emailInput = document.getElementById("email");
const tabsBtn = document.getElementsByClassName("tab");
const linkSection = document.querySelector(".app-links");
const profileSection = document.querySelector(".app-profile");
const userInfoForm = document.querySelector(".profile-form");
const userInfoInputs = document.querySelectorAll(".input-group-2 input");

const urlRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:(?:github|gitlab)\.com\/[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}|dev\.to\/[A-Za-z0-9_\-]+|codewars\.com\/users\/[A-Za-z0-9_\-]+|hashnode\.com\/@?[A-Za-z0-9_\-]+|youtube\.com\/(?:@|user\/|c\/)[A-Za-z0-9_\-]+|freecodecamp\.org\/(?:news\/author\/)?[A-Za-z0-9_\-]+|frontendmentor\.io\/(?:profile|users)\/[A-Za-z0-9_\-]+|facebook\.com\/(?:profile\.php\?id=\d+|[A-Za-z0-9\.\-_]+)|linkedin\.com\/in\/[A-Za-z0-9\-]+|(?:twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}|twitch\.tv\/[A-Za-z0-9_]{4,25})(?:\/.*)?$/i;

let linkNumber = 0;

// Add Event Listeners
addLinkBtn.addEventListener("click", renderNewLink);
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

// Render a new link element into the DOM
function renderNewLink() {
  // Increment Link #
  linkNumber += 1;

  // Variables
  const dragElement = document.createElement("div");
  dragElement.classList.add("draggable");
  dragElement.id = `dragItem-${linkNumber}`;
  dragElement.draggable = true;
  const addLinkTemplate = `
    <div class="input-container">
      <div class="input-header">
      <div class="input-header-label">
          <img
          src="/assets/images/icon-drag-and-drop.svg"
          alt="dran and drop icon"
          />
          <span class="link-label">Link #${linkNumber}</span>
      </div>

      <button type="button" class="link-remove">Remove</button>
      </div>

      <div class="input-group">
      <label for="input-platform-${linkNumber}" class="input-label">Platform</label>
      <div class="input-control">
          <span class="platform-logo platform-logo-container-${linkNumber}">
          <img
              src="/assets/images/icon-codepen.svg"
              alt="icon of codepen platform"
          />
          </span>
          <select name="platform" id="input-platform-${linkNumber}">
              ${logosArr.map(function (logo) {
                return `<option value="${logo.value}">${logo.name}</option>`;
              })}
          </select>

          <img src="/assets/images/arrow-down.svg" alt="arrow down icon" class="select-arrow-icon" >
      </div>
      </div>

      <div class="input-group">
      <label for="link-${linkNumber}" class="input-label">Link</label>
      <div class="input-info-wrapper">
      <div class="input-control">
          <span class="platform-logo">
          <img src="/assets/images/icon-link.svg" alt="" />
          </span>
          <input
          type="text"
          name="link"
          id="link-${linkNumber}"
          class="input-el"
          placeholder="e.g. https://www.github.com/johnappleseed"
          />
      </div>
      </div>
      </div>
    </div
    `;

  // Set the new 'link HTML' template
  dragElement.innerHTML = addLinkTemplate;

  // Append a new child element
  addLinkEmpty.style.display = "none";
  formContainer.appendChild(dragElement);

  // Enable save button
  saveBtn.disabled = false;

  // Event Listener
  const inputSelect = document.getElementById(`input-platform-${linkNumber}`);
  inputSelect.addEventListener("change", function (e) {
    const { value, id } = e.target;
    const linkId = Number(id[id.length - 1]);
    renderIcon(value, id);
    renderLinkUser(value, linkId - 1);
  });

  // DRAG AND DROP EVENT LISTENERS
  dragElement.addEventListener("dragstart", dragStart);
  dragElement.addEventListener("dragend", dragEnd);
  dragElement.addEventListener("dragover", dragOver);
  dragElement.addEventListener("drop", drop);

  // Display link to the mockup phone
  displayMockupShape(linkNumber - 1);
}

// Transfer the draggable element's data in JSON format
function dragStart(e) {
  const payload = {
    nodeId: this.id,
    dragData: {
      platformName: document.querySelector(`#${this.id} select`)?.value,
      link: document.querySelector(`#${this.id} input`)?.value,
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
  if (this.id === nodeId) return;

  const currentSelectEL = document.querySelector(`#${this.id} select`);
  const currentInputEl = document.querySelector(`#${this.id} input`);

  const sourceSelectEl = document.querySelector(`#${nodeId} select`);
  const sourceInputEl = document.querySelector(`#${nodeId} input`);

  sourceSelectEl.value = currentSelectEL.value;
  sourceInputEl.value = currentInputEl.value;
  renderIcon(currentSelectEL.value, sourceSelectEl.id);
  renderLinkUser(
    currentSelectEL.value,
    Number(sourceSelectEl.id[sourceSelectEl.id.length - 1]) - 1
  );

  currentSelectEL.value = dragData.platformName;
  currentInputEl.value = dragData.link;
  renderIcon(dragData.platformName, currentSelectEL.id);
  renderLinkUser(
    dragData.platformName,
    Number(currentSelectEL.id[currentSelectEL.id.length - 1]) - 1
  );
}

// Render the matched icon based on the selecting dropdown
function renderIcon(iconName, idLink) {
  const idNumber = Number(idLink[idLink.length - 1]);

  document.querySelector(
    `.platform-logo-container-${idNumber}`
  ).innerHTML = `<img src="/assets/images/icon-${iconName}.svg" alt="${iconName} icon">`;
}

// Render links on the mockup phone
function displayMockupShape(index) {
  if (index < linkShapes.length) {
    linkShapes[index].innerHTML = `
    <img src="/assets/images/icon-github-white.svg" alt="github icon">
    <span class="link-item-name">github</span>
    <img src="/assets/images/icon-arrow-right.svg" alt="arrow right icon" class="link-arrow-right">
  `;
    linkShapes[index].classList.remove("shape-element");
    linkShapes[index].classList.add("link-item__active");
  } else {
    const liEl = document.createElement("li");
    const divEl = document.createElement("div");
    liEl.classList.add("link-item");
    divEl.classList.add("link-item-container", "link-item__active");
    divEl.innerHTML = `
      <img src="/assets/images/icon-github-white.svg" alt="github icon">
      <span class="link-item-name">github</span>
      <img src="/assets/images/icon-arrow-right.svg" alt="arrow right icon" class="link-arrow-right">
    `;

    liEl.appendChild(divEl);
    linksContainer.appendChild(liEl);
  }
}

function renderLinkUser(value, id) {
  const linkData = logosArr
    .filter(function (link) {
      return link.value === value;
    })
    .at(0);

  removeLinksClass(id);

  linkShapes[id].classList.add(linkData.className);
  linkShapes[id].children[0].src = linkData.path;
  linkShapes[id].children[1].textContent = linkData.name;
}

// Remove the last links' classes
function removeLinksClass(id) {
  const lastClassValue = linkShapes[id].classList.length;

  for (let link of logosArr) {
    if (link.className === linkShapes[id].classList[lastClassValue - 1]) {
      linkShapes[id].classList.remove(
        linkShapes[id].classList[lastClassValue - 1]
      );
    }
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
