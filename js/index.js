// Imports
import { logosArr } from "../js/data.js";

// VARIABLES
const addLinkBtn = document.getElementById("add-link");
const formContainer = document.querySelector(".form-container");
const saveBtn = document.getElementById("save");
const addLinkEmpty = document.querySelector(".add-link-empty");
let linkNumber = 0;

// Add Event Listeners
addLinkBtn.addEventListener("click", renderNewLink);

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
            ${logosArr.map(function (iconName) {
              return `<option value="${iconName}">${iconName}</option>`;
            })}
        </select>
    </div>
    </div>

    <div class="input-group">
    <label for="link" class="input-label">Link</label>
    <div class="input-control">
        <span class="platform-logo">
        <img src="/assets/images/icon-link.svg" alt="" />
        </span>
        <input
        type="text"
        name="link"
        id="link"
        class="pl-16"
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
  inputSelect.addEventListener("change", renderIcon);
}

// Render the matched icon based on the selecting dropdown
function renderIcon(e) {
  const iconName = e.target.value;
  const idString = e.target.id;
  const idNumber = Number(idString[idString.length - 1]);

  document.querySelector(
    `.platform-logo-container-${idNumber}`
  ).innerHTML = `<img src="/assets/images/icon-${iconName}.svg" alt="${iconName} icon">`;
}
