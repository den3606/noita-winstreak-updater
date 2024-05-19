import { dialog } from "@tauri-apps/api";
import { OpenDialogOptions, SaveDialogOptions } from "@tauri-apps/api/dialog";
import { readBinaryFile, readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { NOITA_WINSTREAK_UPDATER } from "./const";

export interface FileItem {
  filePath: string;
  data: string | Uint8Array;
}

export interface BinaryFileItem extends FileItem {
  data: Uint8Array;
}

export interface TextFileItem extends FileItem {
  data: string;
}

const dialogOption = {
  filters: [
    {
      extensions: ["txt"],
      name: "テキストファイル",
    },
    {
      extensions: ["*"],
      name: "全てのファイル",
    },
  ],
};

export const loadBinaryFile = async (): Promise<BinaryFileItem> => {
  const filePath = await dialog.open({
    directory: false,
  });

  if (typeof filePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  const data = await readBinaryFile(filePath);

  return { filePath, data };
};

export const loadTextFile = async (): Promise<TextFileItem> => {
  const filePath = await dialog.open({
    directory: false,
  });

  if (typeof filePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  const data = await readTextFile(filePath);

  return { filePath, data };
};

export const saveTextFile = async (text: string): Promise<void> => {
  const filePath = await dialog.save(dialogOption);

  if (typeof filePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  await writeTextFile(filePath, text);
};

export const selectTargetFile = async (filePath?: string): Promise<string> => {
  const options = ((): OpenDialogOptions => {
    if (filePath) {
      return {
        ...dialogOption,
        defaultPath: filePath,
      };
    }
    return dialogOption;
  })();
  const selectedFilePath = await dialog.open(options);

  if (typeof selectedFilePath !== "string") {
    throw new Error("ファイルを選択してください");
  }

  return selectedFilePath;
};

export const saveJsonFile = async (fileName: string, jsonData: object): Promise<void> => {
  try {
    // JSONデータを文字列に変換
    const jsonString = JSON.stringify(jsonData);

    // ファイルに書き込む
    await writeTextFile(fileName, jsonString, { dir: BaseDirectory.AppLocalData });
    console.log(`Data saved to ${fileName}`);
  } catch (error) {
    console.error("Failed to save file:", error);
  }
};

export const loadJsonFile = async (filename: string): Promise<object> => {
  try {
    // ファイルからテキストデータを読み込む
    const jsonString = await readTextFile(filename, { dir: BaseDirectory.AppLocalData });

    // 読み込んだテキストデータをJSONオブジェクトに変換
    const jsonData = JSON.parse(jsonString);

    console.log(`Data read from ${filename}:`, jsonData);
    return jsonData;
  } catch (error) {
    console.error("Failed to read file:", error);
    return {};
  }
};
