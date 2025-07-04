import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  IsEmail,
  IsUUID,
  Length,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Decision } from "./decision.model";
import { UserAttributes } from "../@types/user.types";
import { Recommendation } from "./recommendation.model";

@Table
export class User extends Model<UserAttributes> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Length({ min: 2, max: 255 })
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Length({ min: 2, max: 255 })
  @Column(DataType.STRING)
  lastName!: string;

  @AllowNull(false)
  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Length({ min: 8, max: 64 })
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  birthDate!: Date;

  @AllowNull(true)
  @Column(DataType.STRING)
  avatar?: string;

  @HasMany(() => Decision)
  decisions!: Decision[];

  @HasMany(() => Recommendation)
  recommendations!: Recommendation[];
}
