export interface Notifier {
  notifyError(type: string, error: Error, moreInfo?: unknown): void;
  notifyServerStart(): void;
  notifyUserRegistrer(userInfo: UserInfo): void;
}

export interface UserInfo {
  name: string;
  generation: number;
}
