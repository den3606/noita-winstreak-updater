export interface StartButtonParams {
  monitorStatus: HTMLParagraphElement;
  templateText: HTMLTextAreaElement;
  filePath: string;
}
export type MonitorStatus = "close" | "timeout" | "undefined";

export interface Settings {
  template: string;
  filePath: string;
}
