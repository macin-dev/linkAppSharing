import { getPlatformData } from "../utils/getPlatformData.js";

// Render the matched icon based on the selecting dropdown
function renderIcon(name, dataid) {
  document.querySelector(
    `[data-id="${dataid}"] .platform-logo`
  ).innerHTML = `<img src="/assets/images/icon-${name}.svg" alt="${name} icon">`;
}

function renderLinkPreview(name, dataid) {
  const link = document.querySelector(
    `[data-id="${dataid}"] .link-item__default`
  );

  const linkData = getPlatformData(name);

  // Remove previous classes
  removeLinksClass(link);

  link.classList.add(linkData.className);
  link.children[0].src = linkData.path;
  link.children[1].textContent = linkData.name;

  return linkData.uuid;
}

// Remove the last link-item class
function removeLinksClass(elRef) {
  const classString = elRef.classList[1];
  if (classString) {
    elRef.classList.remove(classString);
  }
}

export { renderIcon, renderLinkPreview };
