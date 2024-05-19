import { NOITA_WINSTREAK_UPDATER } from "../const";
import { loadJsonFile, saveJsonFile, saveTextFile, selectTargetFile } from "../file";
import type { Settings } from "../interfaces";

const click = async (event: Event) => {
  event.preventDefault();
  const settings: Settings = (await loadJsonFile(NOITA_WINSTREAK_UPDATER.SETTINGS_FILE)) as Settings;
  const selectedFilePath = await selectTargetFile(settings.filePath);
  settings.filePath = selectedFilePath;
  await saveJsonFile(NOITA_WINSTREAK_UPDATER.SETTINGS_FILE, settings);
  return settings.filePath;
};

export const outFileSelectButton = {
  click,
};
