import pgd from "pg-promise";

const pg = pgd();

export const db = pg({
  host: "localhost",
  port: 5432,
  password: "casper@21",
  database: "project_hub",
  user: "postgres",
});
