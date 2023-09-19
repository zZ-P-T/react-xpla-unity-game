import './container.css';

import { CSSProperties } from 'react';
import { Unity } from 'react-unity-webgl';

import { useXplaUnityGame } from './context';

export interface XplaUnityGameContainerProps {
  loading?: boolean;
  style?: CSSProperties;
}

export const XplaUnityGameContainer = ({
  loading,
  style,
}: XplaUnityGameContainerProps) => {
  const {
    unityContextHook: { unityProvider, isLoaded, loadingProgression },
  } = useXplaUnityGame();

  const defaultStyle: CSSProperties = {
    width: '100vw',
    height: '100hw',
  };

  const loadingPercentage = Math.round(loadingProgression * 100);

  const renderLoading = () => {
    if (!isLoaded && loading) {
      return (
        <div className="wrap">
          <h1>
            Loading
            <span className="animate-pulse">.</span>
            <span className="animate-pulse">.</span>
            <span className="animate-pulse">.</span>
          </h1>
          <div className="loading">
            <span style={{ width: `${loadingPercentage}%` }} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <>{renderLoading()}</>

      <Unity
        style={{
          ...defaultStyle,
          ...style,
        }}
        className=""
        unityProvider={unityProvider}
      />
    </>
  );
};
