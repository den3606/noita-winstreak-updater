export interface StartButtonParams {
  monitorStatus: HTMLParagraphElement;
  template: string;
  filePath: string;
}
export type MonitorStatus = "close" | "timeout" | "undefined";

export interface Settings {
  template: string;
  filePath: string;
}
