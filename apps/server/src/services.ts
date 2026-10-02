import { createAuth } from "@sunrise/auth";
import { createDb } from "@sunrise/db";

import { ENV } from "./env.server";

export const db = await createDb(ENV);
export const auth = createAuth(ENV, db);
