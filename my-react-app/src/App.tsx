import * as React from 'react';
import {
  FluentProvider,
  Toaster,
  webLightTheme,
} from '@fluentui/react-components';
import AppShell from './components/AppShell';
import { APP_TOASTER_ID } from './components/toast';

function App() {
  return (
    <FluentProvider theme={webLightTheme} style={{ height: '100%' }}>
      <AppShell />
      <Toaster toasterId={APP_TOASTER_ID} position="bottom-end" />
    </FluentProvider>
  );
}

export default App;
