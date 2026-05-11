import { User } from '../../domain/entities/user/User';
import { UsersRepo } from '../../domain/repos/UsersRepo.port';

export class MemoryUsersRepo implements UsersRepo {
  private users: Map<string, any> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async getAll() {
    return Array.from(this.users.values());
  }

  async getById(id: string) {
    return this.users.get(id) || null;
  }

  async deleteById(id: string): Promise<void> {
    this.users.delete(id);
  }
}
