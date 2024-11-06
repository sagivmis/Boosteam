import { Button, IconButton } from "@mui/material";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import Player from "../Player";
import "./teams.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { copyImg, genTeamString } from "../../util";
import ContentCopy from "@mui/icons-material/ContentCopyRounded";
import useScreenshot from "use-screenshot-hook";
import Camera from "@mui/icons-material/CameraAltRounded";
import { useCallback, useEffect, useRef, useState } from "react";

const Teams = () => {
  const [showTeams, setShowTeams] = useState(false);

  const { teams } = usePlayersContext();
  const teamsRef = useRef<HTMLDivElement>(null);

  const { image, takeScreenshot, clear } = useScreenshot({ ref: teamsRef });

  const handleScreenshot = useCallback(async () => {
    takeScreenshot();
  }, []);

  const handleCopyImage = useCallback(() => {
    copyImg(image);
    clear();
  }, [image]);

  useEffect(() => {
    handleCopyImage();
  }, [image]);

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
        {showTeams &&
          Object.values(teams).map((team, index) => {
            return (
              <div className="team-container" key={`team--${index}`}>
                <h4 className="team-id">Team {index + 1}:</h4>
                <div className="team">
                  {team.map((player) => (
                    <Player player={player} />
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
