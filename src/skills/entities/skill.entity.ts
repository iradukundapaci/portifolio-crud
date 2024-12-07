import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Portfolio } from "src/portfolio/entities/portfolio.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { SkillLevel } from "../enums/skill-level.enum";

@Entity("skills")
export class Skill extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  level: SkillLevel;

  @Column()
  experience: number;

  @Column()
  description: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.skills)
  portfolio: Portfolio;
}
