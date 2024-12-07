import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Portfolio } from "./entities/portfolio.entity";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { paginate } from "nestjs-typeorm-paginate";
import { FetchPortfolioDto } from "./dto/fetch-portifolio.dto";
import { UsersService } from "src/users/users.service";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { Skill } from "src/skills/entities/skill.entity";
import { Project } from "src/projects/entities/project.entity";

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    private readonly usersService: UsersService,
  ) {}

  async findMyPortfolio(userId: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!portfolio) {
      throw new NotFoundException("Portfolio not found");
    }

    return portfolio;
  }
  async create(
    userId: number,
    createPortfolioDto: CreatePortfolioDto.Input,
    fileName: string,
  ) {
    const user = await this.usersService.findUserById(userId);
    const portfolio = new Portfolio();
    portfolio.profession = createPortfolioDto.profession;
    portfolio.description = createPortfolioDto.description;
    portfolio.profession = createPortfolioDto.profession;
    portfolio.profilePicture = fileName;

    for (const skill of createPortfolioDto.skills) {
      const newSkill = new Skill();
      newSkill.name = skill.name;
      newSkill.level = skill.level;
      newSkill.experience = skill.experience;
      newSkill.description = skill.description;
      newSkill.portfolio = portfolio;
      portfolio.skills.push(newSkill);
    }

    for (const project of createPortfolioDto.projects) {
      const newProject = new Project();
      newProject.name = project.name;
      newProject.description = project.description;
      newProject.githubLink = project.gitHubLink;
      newProject.technologies = project.technologies;
      newProject.portfolio = portfolio;
      portfolio.projects.push(newProject);
    }

    portfolio.user = user;
    return await this.portfolioRepository.save(portfolio);
  }

  async findAll(input: FetchPortfolioDto.Input) {
    const queryBuilder = this.portfolioRepository
      .createQueryBuilder("portfolio")
      .leftJoinAndSelect("portfolio.user", "user")
      .select([
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
        "user.id",
        "user.email",
      ]);

    return await paginate<Portfolio>(queryBuilder, {
      page: input.page,
      limit: input.size,
    });
  }

  async findOne(id: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id,
      },
    });

    if (!portfolio) {
      throw new NotFoundException("Portfolio not found");
    }

    return portfolio;
  }

  async update(
    userId: number,
    portfoilioId: number,
    updatePortfolioDto: UpdatePortfolioDto.Input,
  ) {
    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id: portfoilioId,
        user: {
          id: userId,
        },
      },
    });

    if (!portfolio) {
      throw new NotFoundException("Portfolio not found");
    }

    return await this.portfolioRepository.save({
      ...portfolio,
      ...updatePortfolioDto,
    });
  }

  async remove(id: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id,
      },
    });

    if (!portfolio) {
      throw new NotFoundException("Portfolio not found");
    }

    return await this.portfolioRepository.softRemove(portfolio);
  }
}
