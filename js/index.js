// VARIABLES
const addLinkBtn = document.getElementById("add-link");
const formContainer = document.querySelector(".form-container");
let linkNumber = 0;

// Add Event Listeners
addLinkBtn.addEventListener("click", renderNewLink);

function renderNewLink() {
  // Add a new add link container into the DOM
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
    <label for="platform" class="input-label">Platform</label>
    <div class="input-control pl-16 pr-16">
        <span class="platform-logo">
        <img
            src="/assets/images/icon-github.svg"
            alt="icon of github platform"
        />
        </span>
        <select name="platform" id="platform">
        <option value="github">GitHub</option>
        <option value="linkedln">Linkedln</option>
        </select>
    </div>
    </div>

    <div class="input-group">
    <label for="link" class="input-label">Link</label>
    <div class="input-control pl-16">
        <span class="platform-logo">
        <img src="/assets/images/icon-link.svg" alt="" />
        </span>
        <input
        type="text"
        name="link"
        id="link"
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
  formContainer.appendChild(inputContainer);
}
