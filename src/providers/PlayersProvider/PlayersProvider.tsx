import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createTeams,
  PlayerType,
  ProviderProps,
  Teams,
  TeamPlayer,
  TeamID,
} from "../../util";

import { v4 as uuid } from "uuid";
import { useSettingsContext } from "../SettingsProvider/SettingsProvider";

interface IPlayersContext {
  players: TeamPlayer[];
  teams: Record<number, TeamPlayer[]>;
  selectedPlayerId: string;
  handleAddPlayer: (player: Omit<PlayerType, "id">) => void;
  handleRemovePlayers: (playerIds: string[]) => void;
  handleLoadTeams: (
    loadedPlayers: TeamPlayer[],
    loadedTeams: Record<number, TeamPlayer[]>
  ) => void;

  handleToggleCheckPlayer: (playerId: string) => void;
  getPlayerById: (playerId: string) => TeamPlayer | undefined;
  handleAssignTeam: (playerId: string, teamId: TeamID) => void;
  handleSelectPlayer: (playerId: string) => void;
  handleRemoveTeamSelection: (playerId: string) => void;
  handleResetPlayer: (playerId: string) => void;
}

const defaultPlayersContext: IPlayersContext = {
  players: [],
  teams: [],
  selectedPlayerId: "",
  handleAddPlayer: () => {},
  handleRemovePlayers: () => {},
  handleLoadTeams: () => {},
  handleToggleCheckPlayer: () => {},
  getPlayerById: () => {
    return undefined;
  },
  handleAssignTeam: () => {},
  handleSelectPlayer: () => {},
  handleRemoveTeamSelection: () => {},
  handleResetPlayer: () => {},
};

const PlayersContext = createContext<IPlayersContext>(defaultPlayersContext);

export const PlayersProvider: React.FC<ProviderProps> = ({ children }) => {
  const { maxPlayers, minDpsPlayers, minSupportPlayers, syncSwaps } =
    useSettingsContext();

  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [teams, setTeams] = useState<Teams>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  const handleLoadTeams = (loadedPlayers: TeamPlayer[], loadedTeams: Teams) => {
    setPlayers(loadedPlayers);
    setTeams(loadedTeams);
  };

  useEffect(() => {
    setTeams(
      createTeams(players, {
        maxPlayers,
        minDpsPlayers,
        minSupportPlayers,
        syncSwaps,
      })
    );
  }, [players, minDpsPlayers, maxPlayers, minSupportPlayers, syncSwaps]);

  const handleSelectPlayer = (playerId: string) =>
    setSelectedPlayerId(playerId);

  const handleAddPlayer = (player: Omit<PlayerType, "id">) => {
    const newPlayer: TeamPlayer = {
      ...player,
      id: uuid(),
      checked: true,
    };
    // new players will be checked by default
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  const handleRemovePlayers = (playerIds: string[]) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => !playerIds.includes(player.id))
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

  const handleAssignTeam = (playerId: string, teamId: TeamID) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, assignedTeamId: teamId } : player
      )
    );
  };

  const handleRemoveTeamSelection = (playerId: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? { ...player, assignedTeamId: undefined }
          : player
      )
    );
  };

  const handleResetPlayer = (playerId: string) => {
    handleRemoveTeamSelection(playerId);
  };

  const getPlayerById = (playerId: string) => {
    return players.find((player) => player.id === playerId);
  };

  const providerMemo = useMemo<IPlayersContext>(
    () => ({
      players,
      teams,
      handleAddPlayer,
      handleRemovePlayers,
      handleLoadTeams,
      handleToggleCheckPlayer,
      getPlayerById,
      handleAssignTeam,
      handleSelectPlayer,
      selectedPlayerId,
      handleRemoveTeamSelection,
      handleResetPlayer,
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
