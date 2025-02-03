// App.tsx (example)
import React from 'react';
import { useAppState } from './store/useAppState';
import SceneCanvas from './components/SceneCanvas';
import PainInputForm from './components/UI/PainInputForm';
import CloudBackground from './components/scenes/CloudBackground';

const App: React.FC = () => {
  const currentScene = useAppState(state => state.currentScene);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Only show PainInputForm if we’re NOT in the TUNNEL scene */}
      { (currentScene !== 'TUNNEL' && currentScene !== 'FOLD') && (
        <>
          <CloudBackground />
          <PainInputForm />
        </>
      )}

      <SceneCanvas />
    </div>
  );
};

export default App;
