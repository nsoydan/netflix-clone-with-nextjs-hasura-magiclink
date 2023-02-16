const { Magic } = require("@magic-sdk/admin");

export const magicAdmin = new Magic(process.env.NEXT_PUBLIC_MAGIC_SERVER_KEY);
