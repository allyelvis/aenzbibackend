-- Create enums
CREATE TYPE "user_role" AS ENUM ('admin', 'manager', 'employee', 'viewer');
CREATE TYPE "order_status" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE "payment_status" AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE "inventory_status" AS ENUM ('in_stock', 'low_stock', 'out_of_stock', 'discontinued');
CREATE TYPE "project_status" AS ENUM ('not_started', 'in_progress', 'on_hold', 'completed', 'cancelled');
CREATE TYPE "task_status" AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE "task_priority" AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE "notification_type" AS ENUM ('system', 'alert', 'message');

-- Create tables
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" user_role NOT NULL DEFAULT 'employee',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "last_login" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "customers" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "phone" VARCHAR(50),
  "address" TEXT,
  "city" VARCHAR(100),
  "state" VARCHAR(100),
  "zip_code" VARCHAR(20),
  "country" VARCHAR(100),
  "notes" TEXT,
  "created_by_id" TEXT REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "products" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "sku" VARCHAR(100) UNIQUE,
  "price" NUMERIC(10, 2) NOT NULL,
  "cost" NUMERIC(10, 2),
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "reorder_level" INTEGER,
  "status" inventory_status NOT NULL DEFAULT 'in_stock',
  "category_id" TEXT REFERENCES "categories"("id"),
  "created_by_id" TEXT REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "orders" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "order_number" VARCHAR(50) NOT NULL UNIQUE,
  "customer_id" TEXT NOT NULL REFERENCES "customers"("id"),
  "order_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" order_status NOT NULL DEFAULT 'pending',
  "subtotal" NUMERIC(10, 2) NOT NULL,
  "tax" NUMERIC(10, 2),
  "shipping" NUMERIC(10, 2),
  "total" NUMERIC(10, 2) NOT NULL,
  "notes" TEXT,
  "created_by_id" TEXT REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "order_items" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "order_id" TEXT NOT NULL REFERENCES "orders"("id"),
  "product_id" TEXT NOT NULL REFERENCES "products"("id"),
  "quantity" INTEGER NOT NULL,
  "unit_price" NUMERIC(10, 2) NOT NULL,
  "subtotal" NUMERIC(10, 2) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "payments" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "order_id" TEXT NOT NULL REFERENCES "orders"("id"),
  "amount" NUMERIC(10, 2) NOT NULL,
  "payment_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "payment_method" VARCHAR(100) NOT NULL,
  "status" payment_status NOT NULL DEFAULT 'pending',
  "transaction_id" VARCHAR(255),
  "notes" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "projects" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "status" project_status NOT NULL DEFAULT 'not_started',
  "budget" NUMERIC(10, 2),
  "manager_id" TEXT REFERENCES "users"("id"),
  "created_by_id" TEXT REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "project_members" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "project_id" TEXT NOT NULL REFERENCES "projects"("id"),
  "user_id" TEXT NOT NULL REFERENCES "users"("id"),
  "role" VARCHAR(100),
  "joined_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tasks" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "project_id" TEXT REFERENCES "projects"("id"),
  "assignee_id" TEXT REFERENCES "users"("id"),
  "status" task_status NOT NULL DEFAULT 'todo',
  "priority" task_priority NOT NULL DEFAULT 'medium',
  "due_date" TIMESTAMP,
  "completed_at" TIMESTAMP,
  "created_by_id" TEXT REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "notifications" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" TEXT NOT NULL REFERENCES "users"("id"),
  "type" notification_type NOT NULL DEFAULT 'system',
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "related_id" TEXT,
  "related_type" VARCHAR(100),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "settings" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "key" VARCHAR(255) NOT NULL UNIQUE,
  "value" TEXT,
  "description" TEXT,
  "is_system" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "audit_logs" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" TEXT REFERENCES "users"("id"),
  "action" VARCHAR(100) NOT NULL,
  "entity_type" VARCHAR(100) NOT NULL,
  "entity_id" TEXT,
  "details" JSONB,
  "ip_address" VARCHAR(50),
  "user_agent" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "customers_name_idx" ON "customers" ("name");
CREATE INDEX "customers_email_idx" ON "customers" ("email");
CREATE INDEX "products_name_idx" ON "products" ("name");
CREATE INDEX "products_sku_idx" ON "products" ("sku");
CREATE INDEX "products_category_id_idx" ON "products" ("category_id");
CREATE INDEX "orders_customer_id_idx" ON "orders" ("customer_id");
CREATE INDEX "orders_status_idx" ON "orders" ("status");
CREATE INDEX "orders_created_at_idx" ON "orders" ("created_at");
CREATE INDEX "order_items_order_id_idx" ON "order_items" ("order_id");
CREATE INDEX "order_items_product_id_idx" ON "order_items" ("product_id");
CREATE INDEX "payments_order_id_idx" ON "payments" ("order_id");
CREATE INDEX "projects_manager_id_idx" ON "projects" ("manager_id");
CREATE INDEX "projects_status_idx" ON "projects" ("status");
CREATE INDEX "tasks_project_id_idx" ON "tasks" ("project_id");
CREATE INDEX "tasks_assignee_id_idx" ON "tasks" ("assignee_id");
CREATE INDEX "tasks_status_idx" ON "tasks" ("status");
CREATE INDEX "notifications_user_id_idx" ON "notifications" ("user_id");
CREATE INDEX "notifications_is_read_idx" ON "notifications" ("is_read");
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" ("user_id");
CREATE INDEX "audit_logs_entity_type_idx" ON "audit_logs" ("entity_type");
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" ("created_at");

