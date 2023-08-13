import { users } from "@prisma/client";

export const Emotes: { [key in keyof users["currency"]]: string } = {
  copper: "<:naomicopper:1140129937173520499>",
  silver: "<:naomisilver:1140129928084455474>",
  gold: "<:naomigold:1140129934526914690>",
  platinum: "<:naomiplatinum:1140129931343446076>",
};
