import { Button, IconButton } from "@mui/material";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import Player from "../Player";
import "./teams.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { copyImg, genTeamString, TeamID } from "../../util";
import ContentCopy from "@mui/icons-material/ContentCopyRounded";
import useScreenshot from "use-screenshot-hook";
import Camera from "@mui/icons-material/CameraAltRounded";
import { useCallback, useEffect, useRef, useState } from "react";
import DeletePlayer from "../Player/DeletePlayer";
import SwapTeam from "../Player/SwapTeam";
import domToImage from "dom-to-image";

const Teams = () => {
  const [showTeams, setShowTeams] = useState(false);

  const {
    teams,
    handleSelectPlayer,
    selectedPlayerId,
    handleAssignTeam,
    handleRemovePlayers,
    handleResetPlayer,
  } = usePlayersContext();
  const teamsRef = useRef<HTMLDivElement>(null);

  const { image, takeScreenshot, clear } = useScreenshot({ ref: teamsRef });

  const [deletePlayerOpen, setDeletePlayerOpen] = useState(false);
  const [swapTeamOpen, setSwapTeamOpen] = useState(false);

  const handleScreenshot = useCallback(async () => {
    if (teamsRef.current) {
      domToImage.toPng(teamsRef.current, { quality: 1 }).then((dataUrl) => {
        console.log(dataUrl);
        copyImg(dataUrl);
      });
    }
  }, []);

  const handleCopyImage = useCallback(() => {
    copyImg(image);
    clear();
  }, [image]);

  const handleSwapTeam = (teamId: TeamID) => {
    handleAssignTeam(selectedPlayerId, teamId);
  };

  const handleOpenDeletePlayer = () => {
    setDeletePlayerOpen(true);
  };
  const handleCloseDeletePlayer = () => {
    setDeletePlayerOpen(false);
  };

  const handleOpenSwapTeam = () => {
    setSwapTeamOpen(true);
  };
  const handleCloseSwapTeam = () => {
    setSwapTeamOpen(false);
  };

  const handleDeletePlayer = (playerId: string) => {
    handleRemovePlayers([playerId]);
    handleCloseDeletePlayer();
  };

  const handleClickPlayer = (playerId: string) => {
    handleSelectPlayer(playerId);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowTeams(true), 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="teams-container">
      <IconButton className="snapshot-btn" onClick={handleScreenshot}>
        <Camera />
      </IconButton>
      <div className="teams" ref={teamsRef}>
        <DeletePlayer
          playerId={selectedPlayerId}
          open={deletePlayerOpen}
          handleClose={handleCloseDeletePlayer}
          handleDeletePlayer={handleDeletePlayer}
          handleOpen={handleOpenDeletePlayer}
        />
        <SwapTeam
          playerId={selectedPlayerId}
          open={swapTeamOpen}
          handleClose={handleCloseSwapTeam}
          handleSwapTeam={handleSwapTeam}
          handleOpen={handleOpenSwapTeam}
        />
        {showTeams &&
          Object.values(teams).map((team, index) => {
            return (
              <div className="team-container" key={`team--${index}`}>
                <h4 className="team-id">Team {index + 1}:</h4>
                <div className="team">
                  {team.map((player) => (
                    <Player
                      player={player}
                      key={player.id}
                      onClick={() => handleClickPlayer(player.id)}
                      onClickDelete={() => handleOpenDeletePlayer()}
                      onClickSwap={() => handleOpenSwapTeam()}
                      onClickRestart={() => handleResetPlayer(player.id)}
                    />
                  ))}
                </div>
                <CopyToClipboard
                  text={genTeamString(team, index)}
                  onCopy={() => {}}
                >
                  <IconButton className="content-copy-container">
                    <ContentCopy className="content-copy" />
                  </IconButton>
                </CopyToClipboard>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Teams;
