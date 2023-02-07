import { Magic } from "magic-sdk";

export const createMagic = () => {
  return (
    typeof Window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  );
};

export const magic = createMagic();
