import { createContext, useContext, useMemo, useState } from "react";
import { ProviderProps, SettingsData, User } from "../../util";

interface ISettingsContext {
  maxPlayers: number;
  minSupportPlayers: number;
  minDpsPlayers: number;
  syncSwaps: boolean;
  loggedIn: boolean;
  user: User | undefined;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
  handleChangeMaxPlayers: (value: number) => void;
  handleChangeMinSupportPlayers: (value: number) => void;
  handleChangeMinDpsPlayers: (value: number) => void;
  handleLoadSettings: (settings: SettingsData) => void;
  handleChangeSyncSwaps: (value: boolean) => void;
}

const defaultSettingsContext: ISettingsContext = {
  maxPlayers: 0,
  minSupportPlayers: 0,
  minDpsPlayers: 0,
  syncSwaps: false,
  loggedIn: false,
  user: { password: "", username: "" },
  handleLogin: () => {},
  handleLogout: () => {},
  handleChangeMaxPlayers: () => {},
  handleChangeMinSupportPlayers: () => {},
  handleChangeMinDpsPlayers: () => {},
  handleLoadSettings: () => {},
  handleChangeSyncSwaps: () => {},
};

const SettingsContext = createContext<ISettingsContext>(defaultSettingsContext);

export const SettingsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [minSupportPlayers, setMinSupportPlayers] = useState(3);
  const [minDpsPlayers, setMinDpsPlayers] = useState(3);
  const [syncSwaps, setSyncSwaps] = useState(true);
  // should change after an hour ( since the auth token only last an hour ) and
  // the prompt to the user that he has logged out
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();

  const handleLogin = (user: User) => {
    setLoggedIn(true);
    setUser(user);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
  };

  const handleChangeMaxPlayers = (value: number) => setMaxPlayers(value);
  const handleChangeMinSupportPlayers = (value: number) =>
    setMinSupportPlayers(value);
  const handleChangeMinDpsPlayers = (value: number) => setMinDpsPlayers(value);
  const handleChangeSyncSwaps = (value: boolean) => setSyncSwaps(value);

  const handleLoadSettings = (settings: SettingsData) => {
    setMaxPlayers(settings.maxPlayers);
    setMinDpsPlayers(settings.minDpsPlayers);
    setMinSupportPlayers(settings.minSupportPlayers);
    setSyncSwaps(settings.syncSwaps);
  };

  const providerMemo = useMemo<ISettingsContext>(
    () => ({
      maxPlayers,
      minSupportPlayers,
      minDpsPlayers,
      syncSwaps,
      loggedIn,
      user,
      handleLogin,
      handleLogout,
      handleChangeSyncSwaps,
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
