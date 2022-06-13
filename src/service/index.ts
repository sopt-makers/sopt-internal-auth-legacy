import { Externals } from "../external";
import { TokenClient } from "../lib/token";
import { Repository } from "../repository";
import { AuthService, createAuthService } from "./authService";
import { createRegisterService, RegisterService } from "./registerService";

export interface Services {
  authService: AuthService;
  registerService: RegisterService;
}

interface CreateServicesDeps {
  repository: Repository;
  externals: Externals;
  tokenClient: TokenClient;
  registerPageUriTemplate: string;
}

export function createServices({
  repository,
  externals,
  tokenClient,
  registerPageUriTemplate,
}: CreateServicesDeps): Services {
  return {
    authService: createAuthService({
      facebookAPIExternal: externals.facebookAPI,
      webHookExternal: externals.webHook,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
      soptMemberRepository: repository.soptMember,
      tokenClient: tokenClient,
    }),
    registerService: createRegisterService({
      emailExternal: externals.email,
      soptMemberRepository: repository.soptMember,
      tokenClient: tokenClient,
      registerPageUriTemplate,
    }),
  };
}
