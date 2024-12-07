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
import { CreateProjectDto } from "./dto/create-project.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectsService } from "./projects.service";
import { FetchProjectDto } from "./dto/fetch-project.dto";

@ApiTags("Project")
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectsService) {}

  @PostOperation("", "Create Project")
  @CreatedResponse()
  @IsUser()
  @ApiRequestBody(CreateProjectDto.Input)
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ConflictResponse,
    ForbiddenResponse,
  )
  async create(
    @Body() createProjectDto: CreateProjectDto.Input,
  ): Promise<GenericResponse> {
    await this.projectService.create(createProjectDto);
    return new GenericResponse("Project created successfully");
  }

  @GetOperation("", "Get All Project")
  @IsAdmin()
  @PaginatedOkResponse(FetchProjectDto.Output)
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findAll(@Query() input: FetchProjectDto.Input) {
    const result = await this.projectService.findAll(input);
    return new GenericResponse("Projects fetched successfully", result);
  }

  @GetOperation("/all/me", "Get All My Project")
  @IsAdmin()
  @PaginatedOkResponse(FetchProjectDto.Output)
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findMyProjects(
    @GetUser("id") userId: number,
    @Query() input: FetchProjectDto.Input,
  ) {
    const result = await this.projectService.findAllUserProject(userId, input);
    return new GenericResponse("My projects fetched successfully", result);
  }

  @GetOperation(":id", "Get Project By Id")
  @OkResponse()
  @IsAdmin()
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findOne(@GetUser("id") userId: number, @Param("id") id: string) {
    return await this.projectService.findOne(+id);
  }

  @GetOperation("/me/:id", "Get My Project By Id")
  @OkResponse()
  @IsAdmin()
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findMyProject(@GetUser("id") userId: number, @Param("id") id: string) {
    return await this.projectService.findMyProject(userId, +id);
  }

  @PatchOperation(":id", "Update Project")
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
    @Body() updateProjectDto: UpdateProjectDto.Input,
  ) {
    await this.projectService.update(userId, +id, updateProjectDto);
    return new GenericResponse("Project updated successfully");
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
    await this.projectService.remove(userId, +id);
    return new GenericResponse("Project deleted successfully");
  }
}
