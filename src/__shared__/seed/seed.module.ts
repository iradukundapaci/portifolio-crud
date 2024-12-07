import { Module } from "@nestjs/common";
import { AdminSeedService } from "./admin-seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminSeedService],
  exports: [AdminSeedService],
})
export class SeedModule {}
