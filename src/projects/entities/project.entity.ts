import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Portfolio } from "src/portfolio/entities/portfolio.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity("projects")
export class Project extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  githubLink: string;

  @Column({ type: "json" })
  technologies: object;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.projects)
  portfolio: Portfolio;
}
