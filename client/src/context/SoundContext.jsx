import React, { 
  createContext, 
  useContext, 
  useRef, 
  useState 
} from "react";


const SoundContext = createContext(null);


export function SoundProvider({ children }) {


  const [soundOn, setSoundOn] = useState(true);

  const soundState = useRef(true);


  const aviatorRef = useRef(null);
  const crashRef = useRef(null);



  const toggleSound = () => {

    const next = !soundState.current;

    soundState.current = next;
    setSoundOn(next);


    if (!next && aviatorRef.current) {

      aviatorRef.current.pause();
      aviatorRef.current.currentTime = 0;

    }

  };



  const playEngine = () => {


    if (!soundState.current) return;


    if (aviatorRef.current) {

      aviatorRef.current.loop = true;
      aviatorRef.current.volume = 1;


      aviatorRef.current.play()
      .catch(err => {

        console.log(
          "Engine sound blocked:",
          err
        );

      });

    }

  };



  const stopEngine = () => {


    if (aviatorRef.current) {

      aviatorRef.current.pause();
      aviatorRef.current.currentTime = 0;

    }

  };



  const playCrash = () => {


    if (!soundState.current) return;


    if (crashRef.current) {

      crashRef.current.currentTime = 0;
      crashRef.current.volume = 1;


      crashRef.current.play()
      .catch(err => {

        console.log(
          "Crash sound blocked:",
          err
        );

      });

    }

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
