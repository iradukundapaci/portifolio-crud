import { Body, Controller, Delete, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  BadRequestResponse,
  ConflictResponse,
  CreatedResponse,
  ErrorResponses,
  ForbiddenResponse,
  GetOperation,
  NotFoundResponse,
  OkResponse,
  PaginatedOkResponse,
  PatchOperation,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";
import { IsAdmin, IsUser } from "src/auth/decorators/authorize.decorator";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";
import { SkillsService } from "./skills.service";
import { FetchSkillDto } from "./dto/fetch-skill.dto";

@ApiTags("Skill")
@Controller("skill")
export class SkillController {
  constructor(private readonly skillService: SkillsService) {}

  @PostOperation("", "Create Skill")
  @CreatedResponse()
  @IsUser()
  @ApiRequestBody(CreateSkillDto.Input)
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ConflictResponse,
    ForbiddenResponse,
  )
  async create(
    @Body() createSkillDto: CreateSkillDto.Input,
  ): Promise<GenericResponse> {
    await this.skillService.create(createSkillDto);
    return new GenericResponse("Skill created successfully");
  }

  @GetOperation("", "Get All Skill")
  @IsAdmin()
  @PaginatedOkResponse(FetchSkillDto.Output)
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findAll(@Query() input: FetchSkillDto.Input) {
    const result = await this.skillService.findAll(input);
    return new GenericResponse("Skills fetched successfully", result);
  }

  @GetOperation("/all/me", "Get All My Skill")
  @IsAdmin()
  @PaginatedOkResponse(FetchSkillDto.Output)
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findMySkills(
    @GetUser("id") userId: number,
    @Query() input: FetchSkillDto.Input,
  ) {
    const result = await this.skillService.findAllUserSkill(userId, input);
    return new GenericResponse("My skills fetched successfully", result);
  }

  @GetOperation(":id", "Get Skill By Id")
  @OkResponse()
  @IsAdmin()
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findOne(@GetUser("id") userId: number, @Param("id") id: string) {
    return await this.skillService.findOne(+id);
  }

  @GetOperation("/me/:id", "Get My Skill By Id")
  @OkResponse()
  @IsAdmin()
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findMySkill(@GetUser("id") userId: number, @Param("id") id: string) {
    return await this.skillService.findMySkill(userId, +id);
  }

  @PatchOperation(":id", "Update Skill")
  @OkResponse()
  @IsUser()
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
  )
  async update(
    @GetUser("id") userId: number,
    @Param("id") id: string,
    @Body() updateSkillDto: UpdateSkillDto.Input,
  ) {
    await this.skillService.update(userId, +id, updateSkillDto);
    return new GenericResponse("Skill updated successfully");
  }

  @Delete(":id")
  @OkResponse()
  @IsUser()
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
  )
  async remove(@GetUser("id") userId: number, @Param("id") id: string) {
    await this.skillService.remove(userId, +id);
    return new GenericResponse("Skill deleted successfully");
  }
}
