import { formData } from "./index.js";

// Validate user's entered data either is empty
// or does not match the correct URL pattern
function validateFormData(e, urlRegex) {
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

  // Validate data before sending
  for (let i = 0; i < formData.length; i++) {
    const link = formData[i].inputData.link.value.toLowerCase();

    if (!urlRegex.test(link)) {
      e.preventDefault();
      return;
    } else if (link.startsWith("www")) {
      formData[i].inputData.link.value = `https://${link}`;
    }
  }

  // Save to local storage
  localStorage.setItem("devlinks", JSON.stringify(formData));
  popupAlert();

  e.preventDefault();
}

function validateUserInfo(e, inputsEl, inputFileEl) {
  for (let i = 0; i < inputsEl.length; i++) {
    const errorMessageEL = document.querySelector(
      `.input-group-2 .error-message-${i + 1}`
    );

    if (inputsEl[i].value.length === 0) {
      createErrorMessageEl(i, "Cant't be empty", inputsEl[i], errorMessageEL);
      inputsEl[i].classList.add("form-control__invalid");
    } else if (errorMessageEL) {
      errorMessageEL.parentElement.removeChild(errorMessageEL);
      inputsEl[i].classList.remove("form-control__invalid");
    }
  }

  const isError = document.querySelector(
    ".profile-form .form-control__invalid"
  );

  if (!isError) {
    const url =
      inputFileEl.files[0] && URL.createObjectURL(inputFileEl.files[0]);

    const dataUser = {
      firstName: inputsEl[0].value,
      lastName: inputsEl[1].value,
      email: inputsEl[2].value,
      path: url || "",
    };

    localStorage.setItem("devlinks-profile", JSON.stringify(dataUser));
    popupAlert();
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

// Alert success
function popupAlert() {
  const popup = document.querySelector(".popup");
  popup.classList.add("alert-success");
  setTimeout(() => {
    popup.classList.remove("alert-success");
  }, 3000);
}

export { validateFormData, validateUserInfo, createErrorMessageEl, popupAlert };
