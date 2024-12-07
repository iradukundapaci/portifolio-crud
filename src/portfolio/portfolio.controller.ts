import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
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
import { PortfolioService } from "./portfolio.service";
import {
  IsAdmin,
  IsAuthorized,
  IsUser,
} from "src/auth/decorators/authorize.decorator";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { FetchPortfolioDto } from "./dto/fetch-portifolio.dto";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { resolve } from "path";
import { existsSync } from "fs";
import { Response } from "express";

@ApiTags("Portfolio")
@Controller("portfolio")
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @PostOperation("", "Create Portfolio")
  @CreatedResponse()
  @IsUser()
  @ApiRequestBody(CreatePortfolioDto.Input)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split(".").pop();
          const uniqueName = `${uuidv4()}.${fileExtension}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ConflictResponse,
    ForbiddenResponse,
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @GetUser("id") userId: number,
    @Body() createPortfolioDto: CreatePortfolioDto.Input,
  ): Promise<GenericResponse> {
    await this.portfolioService.create(
      userId,
      createPortfolioDto,
      file.filename,
    );
    return new GenericResponse("Portfolio created successfully");
  }

  @GetOperation("download/:filename", "Download File")
  async downloadFile(
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    const filePath = resolve(__dirname, "../../uploads", filename);
    const exists = existsSync(filePath);

    if (!exists) {
      throw new NotFoundException("File not found");
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        throw new Error("Error sending file");
      }
    });
  }

  @GetOperation("", "Get All Portfolio")
  @IsAdmin()
  @PaginatedOkResponse(FetchPortfolioDto.Output)
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findAll(@Query() input: FetchPortfolioDto.Input) {
    return await this.portfolioService.findAll(input);
  }

  @GetOperation("me", "Get my Portfolio")
  @OkResponse()
  @IsUser()
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findMyPortfolio(@GetUser("id") id: number) {
    return await this.portfolioService.findMyPortfolio(id);
  }

  @GetOperation(":id", "Get Portfolio By Id")
  @OkResponse()
  @IsAdmin()
  @ErrorResponses(ForbiddenResponse, UnauthorizedResponse, BadRequestResponse)
  async findOne(@Param("id") id: string) {
    return await this.portfolioService.findOne(+id);
  }

  @PatchOperation(":id", "Update Portfolio")
  @OkResponse()
  @IsAuthorized()
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
  )
  async update(
    @GetUser("id") userId: number,
    @Param("id") id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto.Input,
  ) {
    await this.portfolioService.update(userId, +id, updatePortfolioDto);
  }

  @Delete(":id")
  @OkResponse()
  @IsAuthorized()
  @ErrorResponses(
    BadRequestResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
  )
  async remove(@Param("id") id: string) {
    return this.portfolioService.remove(+id);
  }
}
