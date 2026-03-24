declare module "cloudflare:workers" {
  interface ProvidedEnv {
    DB: D1Database;
  }
}
