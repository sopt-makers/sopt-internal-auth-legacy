import { Database } from "../database";
import { createEmailRepository, EmailRepository } from "./email";
import { createFacebookAPIRepository, FacebookAPIRepository } from "./facebookAPI";
import { createFacebookAuthRepository, FacebookAuthRepository } from "./facebookAuth";
import { createSoptMemberRepsitory, SoptMemberRepsitory } from "./soptPerson";
import { createUserRepository, UserRepository } from "./user";

export interface Repository {
  user: UserRepository;
  facebookAPI: FacebookAPIRepository;
  facebookAuth: FacebookAuthRepository;
  soptMember: SoptMemberRepsitory;
  email: EmailRepository;
}

interface RepositoryDeps {
  db: Database;
  facebookAppId: string;
  facebookAppSecret: string;
  facebookAppRedirectUri: string;
}

export function createRepository({
  db,
  facebookAppId,
  facebookAppSecret,
  facebookAppRedirectUri,
}: RepositoryDeps): Repository {
  return {
    facebookAPI: createFacebookAPIRepository({
      clientAppId: facebookAppId,
      clientSecret: facebookAppSecret,
      redirectUri: facebookAppRedirectUri,
    }),
    user: createUserRepository(db),
    facebookAuth: createFacebookAuthRepository({ db }),
    soptMember: createSoptMemberRepsitory({ db }),
    email: createEmailRepository({ senderAddress: "asdf" }),
  };
}
