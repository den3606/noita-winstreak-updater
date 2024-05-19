import { startWatchingButton } from "./events/start-watching-button";
import { outFileSelectButton } from "./events/out-file-select-button";
import { endWatchingButton } from "./events/end-watching-button";

async function main() {
  const startWatching = document.querySelector("#startWatching") as HTMLButtonElement;
  const endWatching = document.querySelector("#endWatching") as HTMLButtonElement;
  const outFileSelect = document.querySelector("#outFileSelect") as HTMLButtonElement;
  const templateText = document.querySelector("#template") as HTMLButtonElement;
  const monitorStatus = document.querySelector("#monitorStatus") as HTMLParagraphElement;
  const template = templateText.value;
  const filePath = "test";

  startWatching.addEventListener("click", async (event: Event) => {
    startWatchingButton.click(event, { monitorStatus, template, filePath });
  });
  endWatching.addEventListener("click", async (event: Event) => {
    endWatchingButton.click(event, { startWatching });
  });
  outFileSelect.addEventListener("click", async (event: Event) => {
    outFileSelectButton.click(event);
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
