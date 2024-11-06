import { eq } from 'drizzle-orm';
import { and, desc } from 'drizzle-orm/expressions';

import { serverDB } from '@/database/server';
import { ThreadStatus, ThreadType } from '@/types/topic';

import { ThreadItem, threads } from '../schemas/lobechat';

interface CreateThreadParams {
  parentThreadId?: string;
  sourceMessageId: string;
  sourcePreview?: string;
  status: ThreadStatus;
  title: string;
  topicId: string;
  type: ThreadType;
}

export class ThreadModel {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  create = async (params: CreateThreadParams) => {
    // @ts-ignore
    const [result] = await serverDB
      .insert(threads)
      .values({ ...params, userId: this.userId })
      .onConflictDoNothing()
      .returning();

    return result;
  };

  delete = async (id: string) => {
    return serverDB.delete(threads).where(and(eq(threads.id, id), eq(threads.userId, this.userId)));
  };

  deleteAll = async () => {
    return serverDB.delete(threads).where(eq(threads.userId, this.userId));
  };

  query = async () => {
    return serverDB.query.threads.findMany({
      orderBy: [desc(threads.updatedAt)],
      where: eq(threads.userId, this.userId),
    });
  };

  findById = async (id: string) => {
    return serverDB.query.threads.findFirst({
      where: and(eq(threads.id, id), eq(threads.userId, this.userId)),
    });
  };

  async update(id: string, value: Partial<ThreadItem>) {
    return serverDB
      .update(threads)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(threads.id, id), eq(threads.userId, this.userId)));
  }
}
