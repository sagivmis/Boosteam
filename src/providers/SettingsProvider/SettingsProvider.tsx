import { createContext, useContext, useMemo, useState } from "react";
import { ProviderProps, SettingsData } from "../../util";

interface ISettingsContext {
  maxPlayers: number;
  minSupportPlayers: number;
  minDpsPlayers: number;
  handleChangeMaxPlayers: (value: number) => void;
  handleChangeMinSupportPlayers: (value: number) => void;
  handleChangeMinDpsPlayers: (value: number) => void;
  handleLoadSettings: (settings: SettingsData) => void;
}

const defaultSettingsContext: ISettingsContext = {
  maxPlayers: 0,
  minSupportPlayers: 0,
  minDpsPlayers: 0,
  handleChangeMaxPlayers: () => {},
  handleChangeMinSupportPlayers: () => {},
  handleChangeMinDpsPlayers: () => {},
  handleLoadSettings: () => {},
};

const SettingsContext = createContext<ISettingsContext>(defaultSettingsContext);

export const SettingsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [minSupportPlayers, setMinSupportPlayers] = useState(3);
  const [minDpsPlayers, setMinDpsPlayers] = useState(3);

  const handleChangeMaxPlayers = (value: number) => setMaxPlayers(value);
  const handleChangeMinSupportPlayers = (value: number) =>
    setMinSupportPlayers(value);
  const handleChangeMinDpsPlayers = (value: number) => setMinDpsPlayers(value);

  const handleLoadSettings = (settings: SettingsData) => {
    setMaxPlayers(settings.maxPlayers);
    setMinDpsPlayers(settings.minDpsPlayers);
    setMinSupportPlayers(settings.minSupportPlayers);
  };

  const providerMemo = useMemo<ISettingsContext>(
    () => ({
      maxPlayers,
      minSupportPlayers,
      minDpsPlayers,
      handleLoadSettings,
      handleChangeMaxPlayers,
      handleChangeMinSupportPlayers,
      handleChangeMinDpsPlayers,
    }),
    [
      handleChangeMaxPlayers,
      handleChangeMaxPlayers,
      handleChangeMinSupportPlayers,
      handleChangeMinDpsPlayers,
    ]
  );

  return (
    <SettingsContext.Provider value={providerMemo}>
      {children}
    </SettingsContext.Provider>
  );
};
export const useSettingsContext = () => useContext(SettingsContext);
