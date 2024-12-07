import { PartialType } from "@nestjs/swagger";
import { CreateProjectDto } from "./create-project.dto";

export namespace UpdateProjectDto {
  export class Input extends PartialType(CreateProjectDto.Input) {}
}
