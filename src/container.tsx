import './container.css';

import { ReactNode } from 'react';
import { Unity } from 'react-unity-webgl';

import { useXplaUnityGame } from './context';

export interface XplaUnityGameContainerProps {
  loading?: ReactNode;
  style?: React.CSSProperties;
}

export const XplaUnityGameContainer = ({
  loading,
  style,
}: XplaUnityGameContainerProps) => {
  const {
    unityContextHook: { unityProvider, isLoaded, loadingProgression },
  } = useXplaUnityGame();

  const defaultStyle: React.CSSProperties = {
    width: '100vw',
    height: '100hw',
  };

  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <>
      {isLoaded === false && (
        <div className="wrap">
          <>
            {loading && (
              <>
                <h1>
                  Loading
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse">.</span>
                </h1>
                <div className="loading">
                  <span style={{ width: `${loadingPercentage}%` }} />
                </div>
              </>
            )}
          </>
        </div>
      )}

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
