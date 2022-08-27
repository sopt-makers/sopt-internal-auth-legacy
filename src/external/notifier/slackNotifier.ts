import { WebClient } from "@slack/web-api";

import { Notifier } from "./types";

interface ChannelMap {
  error?: string;
  info?: string;
  join?: string;
}

export class SlackNotifier implements Notifier {
  private slack: WebClient;

  constructor(botToken: string, private channel: ChannelMap) {
    this.slack = new WebClient(botToken);
  }

  async notifyError(type: string, error: Error, moreInfo: unknown) {
    if (!this.channel.error) {
      return;
    }

    const moreInfoBlock = moreInfo
      ? [
          {
            title: "추가 정보",
            value: JSON.stringify(moreInfo),
            short: false,
          },
        ]
      : [];

    await this.slack.chat.postMessage({
      channel: this.channel.error,
      attachments: [
        {
          mrkdwn_in: ["text"],
          color: "#ff0000",
          pretext: "인증 서버에서 처리되지 않은 오류가 발생했어요! :smiling_face_with_tear:",
          fields: [
            {
              title: "종류",
              value: type,
              short: false,
            },
            {
              title: "오류 메시지",
              value: error.message,
              short: false,
            },
            {
              title: "스택 정보",
              value: `${error.stack}`,
              short: false,
            },
            ...moreInfoBlock,
          ],
          ts: `${Date.now()}`,
        },
      ],
    });
  }

  async notifyServerStart() {
    if (!this.channel.info) {
      return;
    }

    await this.slack.chat.postMessage({
      channel: this.channel.info,
      text: "인증 서버가 시작되었어요! :rocket:",
    });
  }
}
