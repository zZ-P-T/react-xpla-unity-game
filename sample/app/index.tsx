import React from 'react';

import { useRegisterEvent, XplaUnityGameContainer } from '../../src';

const App = () => {
  // ---------------------------------------------
  // register event
  // ---------------------------------------------
  useRegisterEvent();

  const style: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
  };

  return <XplaUnityGameContainer style={style} />;
};

export default App;
