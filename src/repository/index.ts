import { Database } from "../database";
import { ConfigRepository, createConfigRepository } from "./config";
import { createFacebookAuthRepository, FacebookAuthRepository } from "./facebookAuth";
import { createSoptMemberRepsitory, SoptMemberRepsitory } from "./soptMember";
import { createUserRepository, UserRepository } from "./user";

export interface Repository {
  user: UserRepository;
  facebookAuth: FacebookAuthRepository;
  soptMember: SoptMemberRepsitory;
  config: ConfigRepository;
}

interface RepositoryDeps {
  db: Database;
}

export function createRepository({ db }: RepositoryDeps): Repository {
  return {
    user: createUserRepository(db),
    facebookAuth: createFacebookAuthRepository({ db }),
    soptMember: createSoptMemberRepsitory({ db }),
    config: createConfigRepository({ db }),
  };
}
