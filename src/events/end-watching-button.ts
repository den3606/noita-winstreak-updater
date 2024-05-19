import { invoke } from "@tauri-apps/api";

const click = async (event: Event, { startWatching }: { startWatching: HTMLButtonElement }) => {
  event.preventDefault();
  const response = await invoke("stop_game_status_monitor").catch((error) => {
    console.error("Failed to start game status monitor:", error);
  });
  // const paths: string | string[] =
  //   'C:\\Users\\Den\\AppData\\LocalLow\\Nolla_Games_Noita\\save00\\stats\\_stats.salakieli';
  // const callBack = (event: DebouncedEvent) => {
  //   console.table(event);
  // };
  // const options: DebouncedWatchOptions = {
  //   delayMs: 1000,
  //   recursive: false,
  // };

  // const stopWatching = await watch(paths, callBack, options);
};

export const endWatchingButton = {
  click,
};
