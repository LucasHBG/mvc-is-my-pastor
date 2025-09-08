import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { v7 as uuidv7 } from 'uuid';

@Entity('users')
@Index(['email'])
@Index(['googleId'])
@Index(['uuid'])
@Index(['isActive'])
@Index(['createdAt'])
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'char', length: 36, unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string;

  @Column({ name: 'google_id', type: 'varchar', length: 255, unique: true, nullable: true })
  googleId: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash: string;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Exclude()
  @Column({ name: 'remember_token', type: 'varchar', length: 100, nullable: true })
  rememberToken: string;

  @Column({ name: 'profile_photo_url', type: 'text', nullable: true })
  profilePhotoUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}
