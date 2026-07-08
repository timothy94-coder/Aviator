import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect
} from "react";


const SoundContext = createContext(null);


export function SoundProvider({ children }) {


  const [soundOn, setSoundOn] = useState(true);

  const soundState = useRef(true);


  const aviatorRef = useRef(null);
  const crashRef = useRef(null);



  useEffect(() => {

    soundState.current = soundOn;

  }, [soundOn]);




  const toggleSound = () => {


    setSoundOn(prev => {


      const next = !prev;


      soundState.current = next;



      if (!next && aviatorRef.current) {

        aviatorRef.current.pause();

        aviatorRef.current.currentTime = 0;

      }


      return next;


    });


  };





  const playEngine = () => {


    if (!soundState.current) return;



    const audio = aviatorRef.current;


    if (!audio) return;



    audio.loop = true;

    audio.volume = 0.5;



    if (audio.paused) {


      audio.play()
      .catch(err => {

        console.log(
          "Engine error:",
          err
        );

      });


    }


  };





  const stopEngine = () => {


    const audio = aviatorRef.current;


    if (!audio) return;



    audio.pause();


    // DON'T reset currentTime
    // resetting was causing the dead audio issue


  };






  const playCrash = () => {


    if (!soundState.current) return;



    const audio = crashRef.current;


    if (!audio) return;



    audio.currentTime = 0;

    audio.volume = 1;



    audio.play()
    .catch(err => {

      console.log(
        "Crash error:",
        err
      );

    });


  };





  return (

    <SoundContext.Provider

      value={{
        soundOn,
        toggleSound,
        playEngine,
        stopEngine,
        playCrash
      }}

    >


      <audio
        ref={aviatorRef}
        src="/sounds/aviator.mp3"
        preload="auto"
      />


      <audio
        ref={crashRef}
        src="/sounds/crash.mp3"
        preload="auto"
      />


      {children}


    </SoundContext.Provider>

  );


}


export const useSound = () => useContext(SoundContext);
