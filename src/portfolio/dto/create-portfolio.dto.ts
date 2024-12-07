import {
  IsArray,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { SkillLevel } from "src/skills/enums/skill-level.enum";

export namespace CreatePortfolioDto {
  class Skills {
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
  }

  class Projects {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    gitHubLink: string;

    @IsArray()
    @IsNotEmpty()
    technologies: string[];
  }
  export class Input {
    @IsString()
    @IsNotEmpty()
    profession: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    profilePicture: string;

    @IsJSON()
    @IsOptional()
    socialLinks?: JSON;

    @IsArray()
    @IsOptional()
    skills?: Skills[];

    @IsArray()
    @IsOptional()
    projects?: Projects[];
  }
}
