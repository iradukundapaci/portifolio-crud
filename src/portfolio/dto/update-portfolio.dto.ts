import { PartialType } from "@nestjs/swagger";
import { CreatePortfolioDto } from "./create-portfolio.dto";

export namespace UpdatePortfolioDto {
  export class Input extends PartialType(CreatePortfolioDto.Input) {}
}
