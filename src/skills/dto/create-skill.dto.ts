import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { SkillLevel } from "../enums/skill-level.enum";

export namespace CreateSkillDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    level: SkillLevel;

    @IsNumber()
    @IsNotEmpty()
    experience: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    portfolioId: number;
  }
}
