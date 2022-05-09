import { Database } from "../database";
import { createFacebookAPIRepository, FacebookAPIRepository } from "./facebookAPI";
import { createFacebookAuthRepository, FacebookAuthRepository } from "./facebookAuth";
import { createUserRepository, UserRepository } from "./user";

export interface Repository {
  user: UserRepository;
  facebookAPI: FacebookAPIRepository;
  facebookAuth: FacebookAuthRepository;
}

interface RepositoryDeps {
  db: Database;
}

export function createRepository({ db }: RepositoryDeps): Repository {
  return {
    facebookAPI: createFacebookAPIRepository({
      clientAppId: "",
      clientSecret: "",
      redirectUri: "",
      adminToken: "",
    }),
    user: createUserRepository(db),
    facebookAuth: createFacebookAuthRepository({ db }),
  };
}
