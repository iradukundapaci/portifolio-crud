import { PartialType } from "@nestjs/swagger";
import { CreateSkillDto } from "./create-skill.dto";

export namespace UpdateSkillDto {
  export class Input extends PartialType(CreateSkillDto.Input) {}
}
