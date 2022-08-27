export interface Notifier {
  notifyError(type: string, error: Error, moreInfo?: unknown): void;
  notifyServerStart(): void;
}
