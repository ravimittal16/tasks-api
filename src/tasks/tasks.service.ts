import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatuses } from './task.model';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private repository: TasksRepository,
  ) {}

  // private tasks: ITask[] = [];
  async getAllTasks(): Promise<Task[]> {
    return await this.repository.find({ status: TaskStatuses.OPEN });
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.repository.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await this.repository.delete({ id: id });
    return task?.affected > 0;
  }

  async createTask(title: string, description: string): Promise<Task> {
    const task = this.repository.create({
      title,
      description,
      status: TaskStatuses.OPEN,
    });
    await this.repository.save(task);
    return task;
  }
}
