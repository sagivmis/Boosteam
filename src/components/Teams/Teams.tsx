import { Button, IconButton } from "@mui/material";
import { usePlayersContext } from "../../providers/PlayersProvider/PlayersProvider";
import Player from "../Player";
import "./teams.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { copyImg, genTeamString } from "../../util";
import ContentCopy from "@mui/icons-material/ContentCopyRounded";
import useScreenshot from "use-screenshot-hook";
import Camera from "@mui/icons-material/CameraAltRounded";
import { useCallback, useEffect, useRef } from "react";

const Teams = () => {
  const { teams } = usePlayersContext();
  const teamsRef = useRef<HTMLDivElement>(null);

  const { image, takeScreenshot, clear } = useScreenshot({ ref: teamsRef });

  const handleScreenshot = useCallback(async () => {
    takeScreenshot();
  }, []);

  const handleCopyImage = useCallback(() => {
    console.log(image);
    copyImg(image);
    clear();
  }, [image]);

  useEffect(() => {
    handleCopyImage();
  }, [image]);

  return (
    <div className="teams-container">
      <IconButton className="snapshot-btn" onClick={handleScreenshot}>
        <Camera />
      </IconButton>
      <div className="teams" ref={teamsRef}>
        {Object.values(teams).map((team, index) => {
          return (
            <div className="team-container">
              <h4 className="team-id">Team {index}:</h4>
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
