import { Externals } from "../external";
import { TokenClient } from "../lib/token";
import { Repository } from "../repository";
import { AuthService, createAuthService } from "./authService";
import { createRegisterService, RegisterService } from "./registerService";
import { createUserService, UserService } from "./userService";

export interface Services {
  authService: AuthService;
  userService: UserService;
  registerService: RegisterService;
}

interface CreateServicesDeps {
  repository: Repository;
  externals: Externals;
  tokenClient: TokenClient;
}

export function createServices({ repository, externals, tokenClient }: CreateServicesDeps): Services {
  return {
    authService: createAuthService({
      facebookAPIExternal: externals.facebookAPI,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
      soptMemberRepository: repository.soptMember,
      tokenClient: tokenClient,
    }),
    userService: createUserService({
      facebookAPIExternal: externals.facebookAPI,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
    }),
    registerService: createRegisterService({
      emailExternal: externals.email,
      soptMemberRepository: repository.soptMember,
      userRepository: repository.user,
      tokenClient: tokenClient,
    }),
  };
}
