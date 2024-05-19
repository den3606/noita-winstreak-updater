import { startWatchingButton } from "./events/start-watching-button";
import { outFileSelectButton } from "./events/out-file-select-button";
import { endWatchingButton } from "./events/end-watching-button";
import { loadJsonFile } from "./file";
import { NOITA_WINSTREAK_UPDATER } from "./const";
import type { Settings } from "./interfaces";

async function main() {
  const settings: Settings = (await loadJsonFile(NOITA_WINSTREAK_UPDATER.SETTINGS_FILE)) as Settings;
  const template = settings.template ?? "WinStreak: {{winStreak}}";
  let filePath = settings.filePath;

  const startWatching = document.querySelector("#startWatching") as HTMLButtonElement;
  const endWatching = document.querySelector("#endWatching") as HTMLButtonElement;
  const outFileSelect = document.querySelector("#outFileSelect") as HTMLButtonElement;
  const templateText = document.querySelector("#template") as HTMLButtonElement;
  const monitorStatus = document.querySelector("#monitorStatus") as HTMLParagraphElement;

  templateText.value = template;

  startWatching.addEventListener("click", async (event: Event) => {
    startWatchingButton.click(event, { monitorStatus, template, filePath });
  });
  endWatching.addEventListener("click", async (event: Event) => {
    endWatchingButton.click(event, { startWatching });
  });
  outFileSelect.addEventListener("click", async (event: Event) => {
    const newFilePath = await outFileSelectButton.click(event);
    filePath = newFilePath;
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  await main().catch(console.error);
});
