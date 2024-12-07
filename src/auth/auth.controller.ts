import { Controller, HttpCode, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  PostOperation,
  OkResponse,
  ApiRequestBody,
  ErrorResponses,
  BadRequestResponse,
  CreatedResponse,
  ConflictResponse,
} from "src/__shared__/decorators";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignupDto } from "./dto/sign-up.dto";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostOperation("/login", "Log in a user")
  @HttpCode(200)
  @OkResponse(SignInDto.Output)
  @ApiRequestBody(SignInDto.Input)
  @ErrorResponses(BadRequestResponse)
  async login(
    @Body() signInDTO: SignInDto.Input,
  ): Promise<GenericResponse<SignInDto.Output>> {
    const payload = await this.authService.signIn(signInDTO);
    return new GenericResponse("Logged in successfully", payload);
  }

  @PostOperation("/signup", "Sign up a new user")
  @CreatedResponse()
  @ApiRequestBody(SignupDto.Input)
  @ErrorResponses(ConflictResponse, BadRequestResponse)
  async SignUp(@Body() signUpDTO: SignupDto.Input): Promise<GenericResponse> {
    await this.authService.signup(signUpDTO);
    return new GenericResponse("User successfully registered");
  }
}
