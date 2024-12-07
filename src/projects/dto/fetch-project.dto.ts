import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";

export namespace FetchProjectDto {
  export class Input extends PaginationDto {
    @IsOptional()
    q?: string;
  }

  export class Output {
    data: any;
  }
}
