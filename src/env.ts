import "dotenv/config";

export const envConfig = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callback: process.env.CALLBACK,

  keySecret: process.env.SECRET_KEY as string,
  webhook: process.env.WEBHOOK,

  adminSecret: process.env.SECRET_ADMIN
}