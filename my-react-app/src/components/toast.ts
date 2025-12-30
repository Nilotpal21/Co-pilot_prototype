import * as React from 'react';
import { ToastIntent, useToastController } from '@fluentui/react-components';

export const APP_TOASTER_ID = 'app-toaster';

export function useAppToast() {
  const { dispatchToast } = useToastController(APP_TOASTER_ID);

  return React.useCallback(
    (message: string, intent: ToastIntent = 'info') => {
      dispatchToast(message, { intent });
    },
    [dispatchToast]
  );
}


