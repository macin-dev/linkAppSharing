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
const urlRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:(?:github|gitlab)\.com\/[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}|dev\.to\/[A-Za-z0-9_\-]+|codewars\.com\/users\/[A-Za-z0-9_\-]+|hashnode\.com\/@?[A-Za-z0-9_\-]+|youtube\.com\/(?:@|user\/|c\/)[A-Za-z0-9_\-]+|freecodecamp\.org\/(?:news\/author\/)?[A-Za-z0-9_\-]+|frontendmentor\.io\/(?:profile|users)\/[A-Za-z0-9_\-]+|facebook\.com\/(?:profile\.php\?id=\d+|[A-Za-z0-9\.\-_]+)|linkedin\.com\/in\/[A-Za-z0-9\-]+|(?:twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}|twitch\.tv\/[A-Za-z0-9_]{4,25})(?:\/.*)?$/i;

let linkNumber = 0;

// Add Event Listeners
addLinkBtn.addEventListener("click", renderNewLink);
formEl.addEventListener("submit", validateFormData);

// Render a new link element into the DOM
function renderNewLink() {
  // Increment Link #
  linkNumber += 1;

  // Variables
  const inputContainer = document.createElement("div");
  const addLinkTemplate = `
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
    <div class="input-control pr-16">
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
    </div>
    </div>

    <div class="input-group">
    <label for="link-${linkNumber}" class="input-label">Link</label>
    <div class="input-control">
        <span class="platform-logo">
        <img src="/assets/images/icon-link.svg" alt="" />
        </span>
        <input
        type="text"
        name="link"
        id="link-${linkNumber}"
        class="pl-16 input-el"
        placeholder="e.g. https://www.github.com/johnappleseed"
        />
    </div>
    </div>
    `;

  // Add the .input-container class for styling
  // Set the new 'link HTML' template
  inputContainer.classList.add("input-container");
  inputContainer.innerHTML = addLinkTemplate;

  // Append a new child element
  addLinkEmpty.style.display = "none";
  formContainer.appendChild(inputContainer);

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

  const linkInput = document.getElementById(`link-${linkNumber}`);
  linkInput.addEventListener("input", function (e) {
    const linkInputContainer = linkInput.parentElement;

    // Add the required styling to hint the user
    // something's wrong with the format
    if (urlRegex.test(e.target.value)) {
      linkInputContainer.classList.remove("form-control__invalid");
    } else {
      linkInputContainer.classList.add("form-control__invalid");
    }
  });

  // Display link to the mockup phone
  displayMockupShape(linkNumber - 1);
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
      if (!errorMessageEL) {
        createErrorMessageEl(i, errorMessage.empty, currentEl);
      } else {
        errorMessageEL.textContent = errorMessage.empty;
      }
    } else if (!urlRegex.test(currentEl.value)) {
      if (!errorMessageEL) {
        createErrorMessageEl(i, errorMessage.url, currentEl);
      } else {
        errorMessageEL.textContent = errorMessage.url;
      }
    } else if (errorMessageEL) {
      currentEl.parentElement.parentElement.removeChild(errorMessageEL);
    }
  }

  e.preventDefault();
}

// Create and render an error message element into the DOM
function createErrorMessageEl(i, message, nodeEl) {
  const span = document.createElement("span");
  span.classList.add("form-error-message", `error-message-${i + 1}`);
  span.textContent = message;

  nodeEl.parentElement.parentElement.appendChild(span);
}
