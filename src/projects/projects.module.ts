import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectController } from "./projects.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { PortfolioModule } from "src/portfolio/portfolio.module";

@Module({
  imports: [TypeOrmModule.forFeature([Project]), PortfolioModule],
  controllers: [ProjectController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
