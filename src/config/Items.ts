import { Item } from "../interfaces/Item";

export const Items: Item[] = [
  {
    name: "Custom Colour Role",
    description: "A custom colour role of your choice.",
    price: 20000,
    internalId: "colour-role",
  },
  {
    name: "Upload an Emote",
    description: "You can submit an emote to be uploaded to the server.",
    price: 1000000,
    internalId: "upload-emote",
  },
  {
    name: "Set Naomi's Nickname",
    description:
      "Make Naomi change her nickname to whatever you want for 24 hours.",
    price: 50000,
    internalId: "set-nick",
  },
  {
    name: "Shut Naomi Up",
    description:
      "Make Naomi shut up for 24 hours. She cannot send any messages in this server.",
    price: 2000000,
    internalId: "shut-up",
  },
  {
    name: "Set Naomi's Status",
    description:
      "Make Naomi change her status to whatever you want for 24 hours.",
    price: 100000,
    internalId: "set-status",
  },
];
