import { renderIcon, renderLinkPreview } from "./renderSocialMediaData.js";
import { formData } from "./index.js";

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
  renderLinkPreview(currentSelectEL.value, sourceSelectEl.dataset.id);

  currentSelectEL.value = dragData.platformName;
  currentInputEl.value = dragData.link;
  renderIcon(dragData.platformName, currentSelectEL.dataset.id);
  renderLinkPreview(dragData.platformName, currentSelectEL.dataset.id);

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

export { dragStart, dragEnd, dragOver, drop };
