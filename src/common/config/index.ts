import { cleanEnv, num, str } from 'envalid';
import { config } from 'dotenv';
config();

export const env = cleanEnv(process.env, {
  PORT: num(),
  ENV: str(),

  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),

  // Default database connection
  DB_HOST: str(),
  DB_PORT: num(),
  DB_USER: str(),
  DB_PASS: str(),

  // Anarxiya database connection
  ANARXIYA_DB_HOST: str({ default: process.env.DB_HOST }),
  ANARXIYA_DB_PORT: num({ default: Number(process.env.DB_PORT) }),
  ANARXIYA_DB_USER: str({ default: process.env.DB_USER }),
  ANARXIYA_DB_PASS: str({ default: process.env.DB_PASS }),

  // Survival database connection
  SURVIVAL_DB_HOST: str({ default: process.env.DB_HOST }),
  SURVIVAL_DB_PORT: num({ default: Number(process.env.DB_PORT) }),
  SURVIVAL_DB_USER: str({ default: process.env.DB_USER }),
  SURVIVAL_DB_PASS: str({ default: process.env.DB_PASS }),

  // BoxPVP database connection
  BOXPVP_DB_HOST: str({ default: process.env.DB_HOST }),
  BOXPVP_DB_PORT: num({ default: Number(process.env.DB_PORT) }),
  BOXPVP_DB_USER: str({ default: process.env.DB_USER }),
  BOXPVP_DB_PASS: str({ default: process.env.DB_PASS }),
});
