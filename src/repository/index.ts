import { Database } from "../database";
import { createFacebookAuthRepository, FacebookAuthRepository } from "./facebookAuth";
import { createSoptMemberRepsitory, SoptMemberRepsitory } from "./soptPerson";
import { createUserRepository, UserRepository } from "./user";

export interface Repository {
  user: UserRepository;
  facebookAuth: FacebookAuthRepository;
  soptMember: SoptMemberRepsitory;
}

interface RepositoryDeps {
  db: Database;
  facebookAppId: string;
  facebookAppSecret: string;
  facebookAppRedirectUri: string;
}

export function createRepository({ db }: RepositoryDeps): Repository {
  return {
    user: createUserRepository(db),
    facebookAuth: createFacebookAuthRepository({ db }),
    soptMember: createSoptMemberRepsitory({ db }),
  };
}
