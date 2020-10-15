import React, { useState, ReactNode } from 'react';
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
interface CompItem {
  name: string;
  bgColor: string;
  comp: () => ReactNode
}
const components: CompItem[] = [
  {
    name: "Radar",
    bgColor: "#262626",
    comp: () => <Radar />,
  },
  {
    name: "Area",
    bgColor: "#262626",
    comp: () => <Area />,
  },
  {
    name: "Bubble",
    bgColor: "#FDF3EC",
    comp: () => <Bubble />,
  },
  {
    name: "fun",
    bgColor: "#FDF3EC",
    comp: () => <Fun />,
  },
];

function App() {
  const [visIndex, setVisIndex] = useState<number>(0);
  return (
    <div className="ui container">
      <div className="ui top attached menu">
        {
          components.map((com, i) => <div className={`${i === visIndex ? 'active' : ''} item`} key={com.name} onClick={() => {
            setVisIndex(i);
          }}>{com.name}</div>)
        }
      </div>
      <div className="ui segment" style={{ backgroundColor: components[visIndex].bgColor }}>
        {
          components[visIndex].comp()
        }
      </div>
      <div style={{ width: "1200px" }}>
        {/* <Radar /> */}
        {/* <Theta /> */}
        {/* <Bubble /> */}
        {/* <Area /> */}
        {/* <Map /> */}
        {/* <Fun /> */}
        {/* <FakeCube /> */}
        {/* <SpaceFacet /> */}
        {/* <Projection /> */}
        {/* <AudioPlayer /> */}
      </div>
    </div>
  );
}

export default App;
