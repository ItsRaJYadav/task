import { User } from 'src/module/user/entities/user.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    if (event.entity.password) {
      event.entity.password = await this.hashPassword(event.entity.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (
      event.entity &&
      event.entity.password &&
      event.entity.password !== event.databaseEntity?.password
    ) {
      const hashed = await this.hashPassword(event.entity.password);
      event.entity.password = hashed;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcryptjs.hash(password, saltRounds);
  }

  afterInsert(event: InsertEvent<User>): void {
    console.log(`A new user has been inserted with id: ${event.entity.id}`);
  }

  afterUpdate(event: UpdateEvent<User>): void {
    console.log(`User with id ${event.entity?.id} was updated`);
  }

  afterRemove(event: RemoveEvent<User>): void {
    console.log(`User with id ${event.entityId} was removed`);
  }
}
