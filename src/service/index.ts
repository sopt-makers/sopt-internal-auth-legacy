import { ServerConfig } from "../config";
import { Externals } from "../external";
import { TokenClient } from "../lib/token";
import { Repository } from "../repository";
import { AuthService, createAuthService } from "./auth";
import { createRegisterService, RegisterService } from "./register";
import { createServerInternalService, ServerInternalService } from "./serverInternal";

export interface Services {
  authService: AuthService;
  registerService: RegisterService;
  serverInternalService: ServerInternalService;
}

interface CreateServicesDeps {
  repository: Repository;
  externals: Externals;
  tokenClient: TokenClient;
  config: ServerConfig;
}

export function createServices({ repository, externals, tokenClient, config }: CreateServicesDeps): Services {
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
      config,
    }),
    serverInternalService: createServerInternalService({
      config,
    }),
  };
}
