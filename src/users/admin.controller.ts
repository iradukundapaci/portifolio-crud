import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Body, Controller, Param } from "@nestjs/common";
import { CreateAdminDTO } from "./dto/create-admin.dto";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  BadRequestResponse,
  ConflictResponse,
  CreatedResponse,
  DeleteOperation,
  ErrorResponses,
  ForbiddenResponse,
  NotFoundResponse,
  OkResponse,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";
import { IsAdmin } from "src/auth/decorators/authorize.decorator";

@ApiTags("Admins")
@Controller("admins")
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @PostOperation("", "create an admin")
  @CreatedResponse()
  @ApiRequestBody(CreateAdminDTO.Input)
  @IsAdmin()
  @ErrorResponses(
    UnauthorizedResponse,
    ForbiddenResponse,
    ConflictResponse,
    BadRequestResponse,
  )
  async createAdmin(
    @Body() createAdminDTO: CreateAdminDTO.Input,
  ): Promise<GenericResponse> {
    await this.usersService.createAdmin(createAdminDTO);
    return new GenericResponse("Admin successfully created");
  }

  @OkResponse()
  @IsAdmin()
  @DeleteOperation(":id", "delete an admin")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async deleteAdmin(@Param("id") id: number): Promise<GenericResponse> {
    await this.usersService.deleteUser(id);
    return new GenericResponse("Admin deleted successfully");
  }
}
