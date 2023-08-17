import type { Load } from "@sveltejs/kit";

export const load: Load = async () => {
  return {
    path: ["Configurações", "Aparência"],
  };
};
