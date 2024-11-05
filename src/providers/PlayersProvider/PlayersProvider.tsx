import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createTeams,
  PlayerType,
  ProviderProps,
  SelectablePlayer,
} from "../../util";

import { v4 as uuid } from "uuid";
import { useSettingsContext } from "../SettingsProvider/SettingsProvider";

interface IPlayersContext {
  players: SelectablePlayer[];
  teams: Record<number, SelectablePlayer[]>;
  handleAddPlayer: (player: Omit<PlayerType, "id">) => void;
  handleRemovePlayers: (playerIds: string[]) => void;
  handleLoadTeams: (
    loadedPlayers: SelectablePlayer[],
    loadedTeams: Record<number, SelectablePlayer[]>
  ) => void;

  handleToggleCheckPlayer: (playerId: string) => void;
}

const defaultPlayersContext: IPlayersContext = {
  players: [],
  teams: [],
  handleAddPlayer: () => {},
  handleRemovePlayers: () => {},
  handleLoadTeams: () => {},
  handleToggleCheckPlayer: () => {},
};

const PlayersContext = createContext<IPlayersContext>(defaultPlayersContext);

export const PlayersProvider: React.FC<ProviderProps> = ({ children }) => {
  const { maxPlayers, minDpsPlayers, minSupportPlayers } = useSettingsContext();

  const [players, setPlayers] = useState<SelectablePlayer[]>([]);
  const [teams, setTeams] = useState<Record<number, SelectablePlayer[]>>([]);

  const handleLoadTeams = (
    loadedPlayers: SelectablePlayer[],
    loadedTeams: Record<number, SelectablePlayer[]>
  ) => {
    setPlayers(loadedPlayers);
    setTeams(loadedTeams);
  };

  useEffect(() => {
    setTeams(
      createTeams(players, { maxPlayers, minDpsPlayers, minSupportPlayers })
    );
  }, [players, minDpsPlayers, maxPlayers, minSupportPlayers]);

  const handleAddPlayer = (player: Omit<PlayerType, "id">) => {
    const newPlayer: SelectablePlayer = {
      ...player,
      id: uuid(),
      checked: true,
    };
    // new players will be checked by default
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  const handleRemovePlayers = (playerIds: string[]) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => playerIds.includes(player.id))
    );
  };

  const handleToggleCheckPlayer = (playerId: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? { ...player, checked: !player.checked }
          : player
      )
    );
  };

  const providerMemo = useMemo<IPlayersContext>(
    () => ({
      players,
      teams,
      handleAddPlayer,
      handleRemovePlayers,
      handleLoadTeams,
      handleToggleCheckPlayer,
    }),
    [players, handleAddPlayer, handleRemovePlayers]
  );
  return (
    <PlayersContext.Provider value={providerMemo}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayersContext = () => useContext(PlayersContext);
