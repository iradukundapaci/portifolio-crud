import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export namespace CreateProjectDto {
  export class Input {
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

    @IsNumber()
    @IsNotEmpty()
    portfolioId: number;
  }
}
