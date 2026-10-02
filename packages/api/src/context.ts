import type { Session } from "@sunrise/auth";
import type { Database } from "@sunrise/db";

export type Context = {
  session: Session | null;
  db: Database;
};
