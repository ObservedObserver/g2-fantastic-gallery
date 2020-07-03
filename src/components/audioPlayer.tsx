import React, { useEffect, useRef, useState } from 'react';
import ControlProjection from '../charts/controlProjection';
const AudioPlayer: React.FC = props => {
    const media = useRef<HTMLMediaElement>(null);
    const [values, setValues] = useState<number[]>([0]);
    useEffect(() => {
        const audioContext = new window.AudioContext();
        const analyser = audioContext.createAnalyser();
        if (media.current) {
          const source = audioContext.createMediaElementSource(media.current);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          // media.current.play();

          const draw = () => {
            analyser.fftSize = 2048;
            const freq = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteTimeDomainData(freq);
            const freqArray = Array.from(freq);
            // console.log(freq);
            let list: number[] = [];
            for (let i = 0; i < freqArray.length; i += 40) {
              let sum: number = 0;
              for (let j = 0; j < 2 && i + j < freqArray.length; j++) {
                sum += freqArray[i + j];
              }
              // console.log(typeof sum)
              list.push(sum);
            }
            setValues(list);
            // requestAnimationFrame(draw);
          };
          draw();
          setInterval(() => {
            draw();
          }, 400);
        }
    }, [])
    return (
      <div>
        {/* {values.join(',')} */}
        {/* <LineChart series={values} /> */}
        <ControlProjection series={values} />
        <audio ref={media} src="/red.mp3" controls autoPlay></audio>
      </div>
    );
}

export default AudioPlayer;
