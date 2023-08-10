import type { AdapterUser } from "@auth/core/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
	log: ["error", "info"],
});

export const adapter = PrismaAdapter(prisma);

adapter.createUser = async ({ email, name, image, emailVerified }) => {
	const tag = Math.floor(Math.random() * 9999)
		.toString()
		.padStart(4, "0");

	const user = await prisma.user.create({
		data: {
			email: email,
			name: name || "typist",
			tag,
			avatar: image || "/user.png",
			username: `${name || "typist"}_${tag}`,
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
