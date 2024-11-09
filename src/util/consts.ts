import {
  PlayerRole,
  PlayerTier,
  PlayerTierDecimal,
  Requirement,
  TeamPlayer,
} from "./types";

export const tiers: PlayerTier[] = ["S", "A", "B", "C", "D"];
export const tiersOrder: Record<PlayerTier | PlayerTierDecimal, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,

  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};
export const roles: PlayerRole[] = ["dps", "support", "alt"];
export const tierColorMapping: Record<PlayerTier | PlayerTierDecimal, string> =
  {
    S: "primary",
    A: "",
    B: "",
    C: "",
    D: "",

    1: "primary",
    2: "",
    3: "",
    4: "",
    5: "",
  };

export const roleColorMapping: Record<PlayerRole, string> = {
  alt: "info",
  dps: "primary",
  support: "secondary",
};

export const tierByRoleColorMapping: Record<
  PlayerRole,
  Record<PlayerTier | PlayerTierDecimal, string>
> = {
  alt: {
    S: "",
    A: "",
    B: "",
    C: "",
    D: "",

    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  },
  dps: {
    S: "primary",
    A: "",
    B: "",
    C: "",
    D: "",

    1: "primary",
    2: "",
    3: "",
    4: "",
    5: "",
  },
  support: {
    S: "secondary",
    A: "",
    B: "",
    C: "",
    D: "",

    1: "secondary",
    2: "",
    3: "",
    4: "",
    5: "",
  },
};

export const dummyPlayers: TeamPlayer[] = [
  {
    id: "1",
    name: "Tiri",
    role: "dps",
    tier: "S",
    checked: true,
  },
  {
    id: "2",
    name: "Tiriss",
    role: "support",
    tier: "S",
    checked: true,
  },
  {
    id: "3",
    name: "Tiri",
    role: "dps",
    tier: "B",
    checked: true,
  },
  {
    id: "4",
    name: "Tiriss",
    role: "alt",
    tier: "A",
    checked: true,
  },
  {
    id: "5",
    name: "Tiri",
    role: "dps",
    tier: "S",
    checked: true,
  },
  {
    id: "6",
    name: "Tiriss",
    role: "support",
    tier: "A",
    checked: true,
  },
  {
    id: "7",
    name: "Tiri",
    role: "alt",
    tier: "S",
    checked: true,
  },
  {
    id: "8",
    name: "Tiriss",
    role: "alt",
    tier: "A",
    checked: false,
  },
  {
    id: "9",
    name: "Tiri",
    role: "dps",
    tier: "S",
    checked: true,
  },
  {
    id: "10",
    name: "Tiriss",
    role: "support",
    tier: "A",
    checked: false,
  },
  {
    id: "11",
    name: "Tiri",
    role: "dps",
    tier: "S",
    checked: true,
  },
  {
    id: "12",
    name: "Tiriss",
    role: "support",
    tier: "A",
    checked: false,
  },
  {
    id: "13",
    name: "Tiri",
    role: "dps",
    tier: "S",
    checked: true,
  },
  {
    id: "14",
    name: "Tiriss",
    role: "support",
    tier: "A",
    checked: false,
  },
  {
    id: "15",
    name: "Tiri",
    role: "dps",
    tier: "S",
    checked: true,
  },
  {
    id: "16",
    name: "Tiriss",
    role: "support",
    tier: "A",
    checked: true,
  },
  {
    id: "17",
    name: "Tiriss",
    role: "support",
    tier: "A",
    checked: true,
  },
];

export const requirements: Requirement[] = [
  {
    label: "min tier S players",
    callback: () => {
      return ["MIN TIER S"];
    },
  },
  {
    label: "max alts",
    callback: () => {
      return ["MAX ALTS"];
    },
  },
  {
    label: "min support players",
    callback: () => {
      return ["MIN SUPPORT PLAYERS"];
    },
  },
  {
    label: "required support (job)",
    callback: () => {
      return [""];
    },
  },
  {
    label: "min alt players",
    callback: () => {
      return ["MIN ALT PLAYERS"];
    },
  },
];

export const selections: Record<string, number[]> = {
  amount: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};
