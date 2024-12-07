import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Project } from "src/projects/entities/project.entity";
import { Skill } from "src/skills/entities/skill.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity("portfolios")
export class Portfolio extends AbstractEntity {
  @Column()
  profession: string;

  @Column()
  description: string;

  @Column({ length: 10 })
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  profilePicture: string;

  @Column({ type: "json", nullable: true })
  socialLinks: object;

  @OneToMany(() => Skill, (skill) => skill.portfolio, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
    nullable: true,
  })
  skills: Skill[];

  @OneToOne(() => User, (user) => user.portfolio, {
    eager: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Project, (project) => project.portfolio, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    eager: true,
    nullable: true,
  })
  projects: Project[];
}
