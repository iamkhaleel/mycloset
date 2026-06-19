import React, {useCallback, useEffect, useState} from 'react';
import CustomAlert from '../components/CustomAlert';

let showAlertHandler = null;

const alert = (title, message, buttons, options) => {
  if (!showAlertHandler) {
    console.warn('AlertProvider is not mounted');
    return;
  }
  showAlertHandler({title, message, buttons, options});
};

export const Alert = {alert};

export function AlertProvider({children}) {
  const [alertConfig, setAlertConfig] = useState(null);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  const showAlert = useCallback(config => {
    setAlertConfig(config);
  }, []);

  useEffect(() => {
    showAlertHandler = showAlert;
    return () => {
      showAlertHandler = null;
    };
  }, [showAlert]);

  return (
    <>
      {children}
      {alertConfig ? (
        <CustomAlert
          visible
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onDismiss={hideAlert}
        />
      ) : null}
    </>
  );
}
