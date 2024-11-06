import { tiersOrder } from "./consts";
import { SelectablePlayer, SettingsData } from "./types";
import { saveAs } from "file-saver";

export const createTeams = (
  players: SelectablePlayer[],
  {
    maxPlayers,
    minDpsPlayers,
    minSupportPlayers,
  }: { maxPlayers: number; minDpsPlayers: number; minSupportPlayers: number }
): Record<number, SelectablePlayer[]> => {
  const availablePlayers = [...players];
  const dpsPlayers = availablePlayers
    .filter((p) => p.role === "dps" && p.tier === "S")
    .sort((a, b) => tiersOrder[b.tier] - tiersOrder[a.tier]);
  const supportPlayers = availablePlayers
    .filter((p) => p.role === "support")
    .sort((a, b) => tiersOrder[b.tier] - tiersOrder[a.tier]);
  const altPlayers = availablePlayers
    .filter((p) => p.role === "alt")
    .sort((a, b) => tiersOrder[b.tier] - tiersOrder[a.tier]);

  const generatedTeams: Record<number, SelectablePlayer[]> = {};

  const numberOfTeams = Math.ceil(availablePlayers.length / maxPlayers);

  for (let i = 0; i < numberOfTeams; i++) {
    generatedTeams[i] = [];
  }

  let teamId = 0;
  while (availablePlayers.length > 0 && teamId < numberOfTeams) {
    const team: SelectablePlayer[] = [];

    // Add DPS players
    let dpsCount = 0;
    for (const player of dpsPlayers) {
      if (availablePlayers.includes(player) && dpsCount < minDpsPlayers) {
        team.push(player);
        availablePlayers.splice(availablePlayers.indexOf(player), 1);
        dpsCount++;
      }

      if (dpsCount >= minDpsPlayers) {
        break;
      }
    }

    // Add Support players
    let supportCount = 0;
    for (const player of supportPlayers) {
      if (
        availablePlayers.includes(player) &&
        supportCount < minSupportPlayers
      ) {
        team.push(player);
        availablePlayers.splice(availablePlayers.indexOf(player), 1);
        supportCount++;
      }

      if (supportCount >= minSupportPlayers) {
        break;
      }
    }

    // Add Alt players if needed to fill the team
    let altCount = 0;
    while (team.length < maxPlayers && altCount < altPlayers.length) {
      const player = altPlayers[altCount];
      if (
        availablePlayers.includes(player) &&
        !team.find((teamPlayer) => teamPlayer.name === player.name)
      ) {
        team.push(player);
        availablePlayers.splice(availablePlayers.indexOf(player), 1);
      }
      altCount++;
    }
    if (dpsCount >= 0 && supportCount >= 0) {
      generatedTeams[teamId] = team;
    } else {
      // If minimum requirements are not met, stop to avoid infinite loop
      break;
    }

    teamId++;
  }

  // Attempt to balance the teams by adding newly added players to less complete teams
  for (const player of availablePlayers) {
    let leastCompleteTeamId = 0;
    let minTeamSize = maxPlayers;

    for (let i = 0; i < Object.keys(generatedTeams).length; i++) {
      if (generatedTeams[i].length < minTeamSize) {
        leastCompleteTeamId = i;
        minTeamSize = generatedTeams[i].length;
      }
    }

    generatedTeams[leastCompleteTeamId].push(player);
  }

  return generatedTeams;
};

export const saveTeamsToFile = (
  players: SelectablePlayer[],
  teams: Record<number, SelectablePlayer[]>,
  settings: SettingsData
) => {
  const teamsArray: SelectablePlayer[] = Object.values(teams).flat();

  const data = {
    players,
    teams: teamsArray,
    settings,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, "data.json");
};

export const loadTeamsFromFile = (
  file: File,
  onLoad: (data: {
    players: SelectablePlayer[];
    teams: Record<number, SelectablePlayer[]>;
    settings: SettingsData;
  }) => void
) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target && event.target.result) {
      const data = JSON.parse(event.target.result as string);

      // Convert teams array back to Record<number, SelectablePlayer[]>
      const teamsRecord: Record<number, SelectablePlayer[]> = {};
      const teamsArray: SelectablePlayer[] = data.teams;
      let teamIndex = 0;
      let teamSize = Math.ceil(
        teamsArray.length / Object.keys(data.teams).length
      );
      for (let i = 0; i < teamsArray.length; i += teamSize) {
        teamsRecord[teamIndex] = teamsArray.slice(i, i + teamSize);
        teamIndex++;
      }

      onLoad({
        players: data.players,
        teams: teamsRecord,
        settings: data.settings,
      });
    }
  };
  reader.readAsText(file);
};

export const calcMinMaxPlayers = (minDps: number, minSupport: number) => {
  return minDps + minSupport;
};

export const genTeamString = (
  team: SelectablePlayer[],
  teamId: number
): string => {
  let playerStr = team
    .map(
      (player, index) =>
        `${index + 1}. ${player.name} ${player.role === "alt" ? "- ALT" : ""}`
    )
    .join("\n\t");

  return `Team ${teamId + 1}: \n\t${playerStr}`;
};

export const copyImg = async (src: string | undefined) => {
  if (src) {
    const img = await fetch(src);
    const imgBlob = await img.blob();
    try {
      navigator.clipboard.write([
        new ClipboardItem({
          "image/png": imgBlob,
        }),
      ]);
    } catch (error) {
      console.error(error);
    }
  }
};

export const sleep = async (s: number) =>
  new Promise((r) => setTimeout(r, s * 1000));
