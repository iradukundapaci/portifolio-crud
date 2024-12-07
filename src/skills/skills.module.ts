import { Module } from "@nestjs/common";
import { SkillsService } from "./skills.service";
import { SkillController } from "./skills.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Skill } from "./entities/skill.entity";
import { PortfolioModule } from "src/portfolio/portfolio.module";

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), PortfolioModule],
  controllers: [SkillController],
  providers: [SkillsService],
})
export class SkillsModule {}
