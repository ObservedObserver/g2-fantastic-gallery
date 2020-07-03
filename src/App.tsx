import React from 'react';
import Radar from './charts/radar';

import Theta from "./charts/theta";
import Bubble from "./charts/bubble";
import Area from './charts/area';
import Map from './charts/map';
import Fun from './charts/fun';
import FakeCube from './charts/Fake3DLayer';
// import SpaceFacet from './charts/spaceFacet';
import Projection from './charts/projection';
import AudioPlayer from './components/audioPlayer';

import './App.css'
function App() {
  return (
    <div className="App" style={{ padding: '1em 5%' }}>
      <div style={{ width: '1200px' }}>
        {/* <Radar /> */}
        {/* <Theta /> */}
        {/* <Bubble /> */}
        {/* <Area /> */}
        {/* <Map /> */}
        {/* <Fun /> */}
        {/* <FakeCube /> */}
        {/* <SpaceFacet /> */}
        {/* <Projection /> */}
        <AudioPlayer />
      </div>
    </div>
  );
}

export default App;
