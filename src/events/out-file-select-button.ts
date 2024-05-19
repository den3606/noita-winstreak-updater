import { saveTextFile } from "../file";

const click = async (event: Event) => {
  event.preventDefault();
  await saveTextFile("hogehoge");
};

export const outFileSelectButton = {
  click,
};
