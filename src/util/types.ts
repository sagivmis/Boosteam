import { ReactNode } from "react";

export type PlayerTierDecimal = 1 | 2 | 3 | 4 | 5;
export type PlayerTier = "S" | "A" | "B" | "C" | "D";
export type PlayerRole = "support" | "dps" | "alt";
export type PlayerType = {
  id: string;
  name: string;
  tier: PlayerTier | PlayerTierDecimal;
  role: PlayerRole;
};
export type SelectablePlayer = PlayerType & { checked: boolean };
export type Requirement = {
  label: string;
  callback: (event: React.MouseEvent<HTMLButtonElement>) => string[];
};

export type ProviderProps = {
  children: ReactNode;
};

export type SettingsData = {
  maxPlayers: number;
  minSupportPlayers: number;
  minDpsPlayers: number;
};
