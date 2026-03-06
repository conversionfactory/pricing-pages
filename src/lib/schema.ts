import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core"

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  pageUrl: text("page_url"),
  headline: text("headline"),
  subtext: text("subtext"),
  tierCount: integer("tier_count"),
  features: text("features").array(),
  extras: text("extras").array(),
  notes: text("notes"),
  screenshotUrl: text("screenshot_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
