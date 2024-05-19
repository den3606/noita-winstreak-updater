import { dialog } from "@tauri-apps/api";
import { readBinaryFile, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

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

  // TODO: Save file path
};
