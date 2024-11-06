/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { boolean, jsonb, pgTable, text, unique } from 'drizzle-orm/pg-core';

import { idGenerator } from '../../utils/idGenerator';
import { timestamps, timestamptz } from './_helpers';
import { messages } from './message';
import { sessions } from './session';
import { users } from './user';

export const topics = pgTable(
  'topics',
  {
    id: text('id')
      .$defaultFn(() => idGenerator('topics'))
      .primaryKey(),
    title: text('title'),
    favorite: boolean('favorite').default(false),
    sessionId: text('session_id').references(() => sessions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    clientId: text('client_id'),
    historySummary: text('history_summary'),
    metadata: jsonb('metadata'),
    ...timestamps,
  },
  (t) => ({
    clientIdUnique: unique('topic_client_id_user_id_unique').on(t.clientId, t.userId),
  }),
);

export type NewTopic = typeof topics.$inferInsert;
export type TopicItem = typeof topics.$inferSelect;

// @ts-ignore
export const threads = pgTable('threads', {
  id: text('id')
    .$defaultFn(() => idGenerator('threads'))
    .primaryKey(),

  title: text('title'),
  type: text('type', { enum: ['continuation', 'standalone'] }).notNull(),
  status: text('status', { enum: ['active', 'deprecated', 'archived'] }).default('active'),
  topicId: text('topic_id')
    .references(() => topics.id, { onDelete: 'cascade' })
    .notNull(),
  sourceMessageId: text('source_message_id')
    .references(() => messages.id, { onDelete: 'set null' })
    .notNull(),
  // @ts-ignore
  parentThreadId: text('parent_thread_id').references(() => threads.id, { onDelete: 'set null' }),

  sourcePreview: text('source_preview'),

  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  lastActiveAt: timestamptz('last_active_at').defaultNow(),
  ...timestamps,
});

export type NewThread = typeof threads.$inferInsert;
export type ThreadItem = typeof threads.$inferSelect;
