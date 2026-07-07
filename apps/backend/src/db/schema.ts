import { pgTable, uuid, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

// 1. Studios Table (A tenant system so that it can be used at both raanana and haifa studios for example)
export const studios = pgTable('studios', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Users Table (Handles authentication roles - admin = all permissions; teacher = only creating/editing/viewing the schedules; student = only viewing their own schedule)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  studioId: uuid('studio_id').references(() => studios.id),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').$type<'admin' | 'teacher' | 'student'>().default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Classes Table (The blueprint for available dance sessions - im not sure how this will run yet because there are private and group classes which are paid for differently)
export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  studioId: uuid('studio_id').references(() => studios.id).notNull(),
  name: text('name').notNull(), // e.g., "Latin Technique" "Specialty Dances"
  level: text('level'),         // e.g., "Newcomer" "Bronze1-2" "Bronze3+"
  capacity: integer('capacity').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});