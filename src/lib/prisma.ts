import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["error", "info", "warn"],
});

export const adapter = PrismaAdapter(prisma);

adapter.createUser = async ({ email, name, image }) => {
  const urlFriendly = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  const tag = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");

  const user = await prisma.user.create({
    data: {
      email: email,
      name: name || "typist",
      tag,
      avatar: image || "/user.png",
      username: `${urlFriendly(name || "typist")}_${tag}`,
      preferences: {
        create: {},
      },
    },
  });

  return {
    email,
    emailVerified: null,
    id: user.id,
    image: user.avatar,
    name: user.name,
  };
};
