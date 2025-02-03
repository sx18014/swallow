// src/components/SceneRouter.tsx

import React from 'react';
import { useAppState } from '../store/useAppState';

// 你的场景组件
import FoldScene from './scenes/FoldScene';
import PaperTunnelScene from './scenes/PaperTunnelScene';
// import ReleaseScene from './scenes/ReleaseScene';

const SceneRouter: React.FC = () => {
  // 从 Zustand 获取当前场景标识
  const currentScene = useAppState((state) => state.currentScene);

  switch (currentScene) {
    case 'FOLD':
      return <FoldScene />;

    case 'TUNNEL':
      return <PaperTunnelScene />;

    // case 'RELEASE':
    //   return <ReleaseScene />;

    // 如果有更多场景可继续写
    // case 'XXX':
    //   return <XxxScene />;
    
    default:
      // 没有匹配时，不渲染任何场景
      return null;
  }
};

export default SceneRouter;
