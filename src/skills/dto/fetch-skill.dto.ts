import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";

export namespace FetchSkillDto {
  export class Input extends PaginationDto {
    @IsOptional()
    q?: string;
  }

  export class Output extends PaginationDto {}
}
