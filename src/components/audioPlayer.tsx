import React, { useEffect, useRef, useState, useCallback } from 'react';
import ControlProjection from '../charts/controlProjection';
import LineChart from './line';
const AudioPlayer: React.FC = props => {
    const media = useRef<HTMLMediaElement>(null);
    const [values, setValues] = useState<number[]>([0]);
    const cacheValues = useRef<number[][]>([[]]);
    const [onPlay, setOnPlay] = useState<boolean>(false);
    const analyserRef = useRef<AnalyserNode>();
    useEffect(() => {
      if (media.current) {
        const audioContext = new window.AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(media.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 2 ** 8;;
        analyserRef.current = analyser;
      }
    }, [])
    const draw = useCallback(() => {
      const GROUP_SIZE = 10;
      if (media.current && analyserRef.current) {
        const analyser = analyserRef.current;
        // media.current.play()
        const freq = new Uint8Array(analyser.frequencyBinCount);
        // analyser.getByteTimeDomainData(freq);
        analyser.getByteFrequencyData(freq);
        const freqArray = Array.from(freq);
        // console.log(freq);
        let list: number[] = [];
        for (let i = 0; i < freqArray.length; i += GROUP_SIZE) {
          let sum: number = 0;
          for (let j = 0; j < GROUP_SIZE && i + j < freqArray.length; j++) {
            sum += freqArray[i + j];
          }
          // console.log(typeof sum)
          list.push(sum);
        }
        if (cacheValues.current.length === 0) {
          setValues(list);
        } else {
          let mean = cacheValues.current[0].map(() => 0);
          for (let i = 0; i < cacheValues.current.length; i++) {
            for (let j = 0; j < mean.length; j++) {
              mean[j] += cacheValues.current[i][j]
            }
          }
          mean.forEach((v, i, arr) => {
            arr[i] /= cacheValues.current.length;
          })
          setValues(list.map((l, i) => (l - mean[i]) ** 2))
        }
        // setValues(list.map((v, i) => Math.abs(v - (oldValues.current[i] || 0))));
        cacheValues.current.push(list);
        if (cacheValues.current.length > 20) {
          cacheValues.current.shift();
        }
        requestAnimationFrame(draw);
      }
    }, [])

    // useEffect(() => {
    //   let timer: NodeJS.Timeout | null = null;
    //   if (onPlay) {
    //     draw();
    //     timer = setInterval(() => {
    //       draw();
    //     }, 400);
    //   }
    //   return () => {
    //     if (timer !== null) {
    //       clearInterval(timer);
    //     } 
    //   }
    // }, [onPlay])

    useEffect(() => {
      requestAnimationFrame(draw)
    }, [onPlay]);
    return (
      <div>
        {/* {values.join(',')} */}
        <div style={{ display: "flex" }}>
          <LineChart series={values} />
          <div style={{ flexGrow: 1, flexBasis: '1000px' }}>
            <ControlProjection series={values} />
          </div>
        </div>
        <audio
          ref={media}
          src="/red.mp3"
          controls
          autoPlay
          onEnded={() => {
            // media.current.pl
            setOnPlay(false);
          }}
          onPlay={() => {
            console.log("play");
            setOnPlay(true);
            draw();
          }}
        ></audio>
      </div>
    );
}

export default AudioPlayer;
