export interface Notifier {
  notifyError(error: Error): void;
  notifyServerStart(): void;
}
