import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill } from "./entities/skill.entity";
import { Repository } from "typeorm";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { FetchSkillDto } from "./dto/fetch-skill.dto";
import { paginate } from "nestjs-typeorm-paginate";

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    private readonly portfolioService: PortfolioService,
  ) {}

  async create(createSkillDto: CreateSkillDto.Input) {
    const portfolio = await this.portfolioService.findOne(
      createSkillDto.portfolioId,
    );
    const skill = new Skill();
    skill.name = createSkillDto.name;
    skill.description = createSkillDto.description;
    skill.experience = createSkillDto.experience;
    skill.level = createSkillDto.level;
    skill.portfolio = portfolio;

    return await this.skillRepository.save(skill);
  }

  async findAll(input: FetchSkillDto.Input) {
    const queryBuilder = this.skillRepository
      .createQueryBuilder("skills")
      .leftJoinAndSelect("skills.portfolio", "portfolio")
      .select([
        "skills.id",
        "skills.name",
        "skills.description",
        "skills.githubLink",
        "skills.technologies",
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
      ]);

    if (input.q) {
      queryBuilder.where("skills.name LIKE :q", { q: `%${input.q}%` });
    }

    return await paginate<Skill>(queryBuilder, {
      page: input.page,
      limit: input.size,
    });
  }

  async findAllUserSkill(userId: number, input: FetchSkillDto.Input) {
    const queryBuilder = this.skillRepository
      .createQueryBuilder("skills")
      .leftJoinAndSelect("skills.portfolio", "portfolio")
      .where("portfolio.user.id = :userId", { userId })
      .select([
        "skills.id",
        "skills.name",
        "skills.description",
        "skills.githubLink",
        "skills.technologies",
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
      ]);

    if (input.q) {
      queryBuilder.where("skills.name LIKE :q", { q: `%${input.q}%` });
    }

    return await paginate<Skill>(queryBuilder, {
      page: input.page,
      limit: input.size,
    });
  }

  async findOne(id: number) {
    const skill = await this.skillRepository.findOne({
      where: {
        id,
      },
    });

    if (!skill) {
      throw new NotFoundException("Skill not found");
    }

    return skill;
  }

  async findMySkill(userId: number, id: number) {
    return await this.skillRepository
      .createQueryBuilder("skills")
      .leftJoinAndSelect("skills.portfolio", "portfolio")
      .where("portfolio.user.id = :userId", { userId })
      .andWhere("skills.id = :id", { id })
      .select([
        "skills.id",
        "skills.name",
        "skills.description",
        "skills.githubLink",
        "skills.technologies",
        "portfolio.id",
        "portfolio.name",
        "portfolio.description",
        "portfolio.profession",
      ])
      .getOne();
  }

  async update(userId: number, id: number, updateSkillDto: any) {
    const skill = await this.findMySkill(userId, id);

    if (!skill) {
      throw new NotFoundException("Skill not found");
    }

    return await this.skillRepository.save({
      ...skill,
      ...updateSkillDto,
    });
  }

  async remove(userId: number, id: number) {
    const skill = await this.findMySkill(userId, id);

    if (!skill) {
      throw new NotFoundException("Skill not found");
    }

    return await this.skillRepository.softRemove(skill);
  }
}
