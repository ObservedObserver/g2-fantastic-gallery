import React from 'react';
import Radar from './charts/radar';

import Theta from "./charts/theta";
import Bubble from "./charts/bubble";
import Area from './charts/area';
import Map from './charts/map';
import Fun from './charts/fun';
import FakeCube from './charts/Fake3DLayer';
import SpaceFacet from './charts/spaceFacet';

import './App.css'
function App() {
  return (
    <div className="App">
      <div>
        {/* <Radar /> */}
        {/* <Theta /> */}
        {/* <Bubble /> */}
        {/* <Area /> */}
        {/* <Map /> */}
        {/* <Fun /> */}
        {/* <FakeCube /> */}
        <SpaceFacet />
      </div>
    </div>
  );
}

export default App;
