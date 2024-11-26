import { createContext, FC, useContext, useMemo, useState } from "react";
import { ProviderProps, ToastVariant } from "../../util";
import { IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import { Close } from "@mui/icons-material";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import clsx from "clsx";

interface IUtilContext {
  handleOpenToast: (message: string, variant?: ToastVariant) => void;
  handleCloseToast: (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
}

const defaultUtilContext: IUtilContext = {
  handleOpenToast: () => {},
  handleCloseToast: () => {},
};

const UtilContext = createContext<IUtilContext>(defaultUtilContext);

export const UtilProvider: FC<ProviderProps> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastClassName, setToastClassName] = useState<ToastVariant>("info");

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenToast = (message: string, variant?: ToastVariant) => {
    setToastMessage(message);
    setToastOpen(true);
    variant && setToastClassName(variant);
  };

  const handleCloseToast = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;

    setToastOpen(false);
  };

  const toastAction = (
    <>
      <IconButton
        size="small"
        onClick={handleCloseToast}
        color="inherit"
        className="toast-action-btn close-toast-btn"
      >
        <Close />
      </IconButton>
    </>
  );

  const providerMemo = useMemo<IUtilContext>(() => {
    return { handleCloseToast, handleOpenToast };
  }, [handleCloseToast, handleOpenToast]);

  return (
    <UtilContext.Provider value={providerMemo}>
      <Snackbar
        ContentProps={{
          classes: { root: clsx(toastClassName, "toast-container") },
        }}
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        action={toastAction}
        message={toastMessage}
      />
      {children}
    </UtilContext.Provider>
  );
};

export const useUtilContext = () => useContext(UtilContext);
