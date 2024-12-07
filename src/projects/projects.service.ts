import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { Repository } from "typeorm";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { FetchProjectDto } from "./dto/fetch-project.dto";
import { paginate } from "nestjs-typeorm-paginate";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly portfolioService: PortfolioService,
  ) {}

  async create(createProjectDto: CreateProjectDto.Input) {
    const portfolio = await this.portfolioService.findOne(
      createProjectDto.portfolioId,
    );
    const project = new Project();
    project.name = createProjectDto.name;
    project.description = createProjectDto.description;
    project.githubLink = createProjectDto.gitHubLink;
    project.technologies = createProjectDto.technologies;
    project.portfolio = portfolio;

    return await this.projectRepository.save(project);
  }

  async findAll(input: FetchProjectDto.Input) {
    const queryBuilder = this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.portfolio", "portfolio")
      .select([
        "project.id",
        "project.name",
        "project.description",
        "project.githubLink",
        "project.technologies",
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
      ]);

    if (input.q) {
      queryBuilder.where("project.name LIKE :q", { q: `%${input.q}%` });
    }

    return await paginate<Project>(queryBuilder, {
      page: input.page,
      limit: input.size,
    });
  }

  async findAllUserProject(userId: number, input: FetchProjectDto.Input) {
    const queryBuilder = this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.portfolio", "portfolio")
      .where("portfolio.user.id = :userId", { userId })
      .select([
        "project.id",
        "project.name",
        "project.description",
        "project.githubLink",
        "project.technologies",
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
      ]);

    if (input.q) {
      queryBuilder.where("project.name LIKE :q", { q: `%${input.q}%` });
    }

    return await paginate<Project>(queryBuilder, {
      page: input.page,
      limit: input.size,
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return project;
  }

  async findMyProject(userId: number, id: number) {
    return await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.portfolio", "portfolio")
      .where("portfolio.user.id = :userId", { userId })
      .andWhere("project.id = :id", { id })
      .select([
        "project.id",
        "project.name",
        "project.description",
        "project.githubLink",
        "project.technologies",
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
      ])
      .getOne();
  }

  async update(userId: number, id: number, updateProjectDto: any) {
    const project = await this.findMyProject(userId, id);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return await this.projectRepository.save({
      ...project,
      ...updateProjectDto,
    });
  }

  async remove(userId: number, id: number) {
    const project = await this.findMyProject(userId, id);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return await this.projectRepository.softRemove(project);
  }
}
