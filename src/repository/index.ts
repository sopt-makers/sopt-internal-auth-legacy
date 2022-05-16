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
      adminToken: "",
    }),
    user: createUserRepository(db),
    facebookAuth: createFacebookAuthRepository({ db }),
  };
}
