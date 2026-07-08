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


  const engineAudio = useRef(null);
  const crashAudio = useRef(null);



  // create engine sound when needed
  const createEngine = () => {

    if (!engineAudio.current) {

      engineAudio.current = new Audio(
        "/sounds/aviator.mp3"
      );

      engineAudio.current.loop = true;
      engineAudio.current.volume = 1;

    }

    return engineAudio.current;

  };



  const createCrash = () => {

    if (!crashAudio.current) {

      crashAudio.current = new Audio(
        "/sounds/crash.mp3"
      );

      crashAudio.current.volume = 1;

    }

    return crashAudio.current;

  };




  const toggleSound = () => {


    const next = !soundState.current;

    soundState.current = next;

    setSoundOn(next);



    if (!next) {


      if (engineAudio.current) {

        engineAudio.current.pause();

        engineAudio.current.currentTime = 0;

      }


      if (crashAudio.current) {

        crashAudio.current.pause();

        crashAudio.current.currentTime = 0;

      }


    }


  };





  const playEngine = async () => {


    if (!soundState.current) return;



    const audio = createEngine();



    try {


      if (audio.paused) {


        audio.currentTime = 0;


        await audio.play();


      }


    } catch(err) {


      console.log(
        "Engine sound error:",
        err
      );


    }


  };






  const stopEngine = () => {


    if (engineAudio.current) {


      engineAudio.current.pause();


      // don't reset here
      // keeps browser audio pipeline alive


    }


  };







  const playCrash = async () => {


    if (!soundState.current) return;



    const audio = createCrash();



    try {


      audio.pause();

      audio.currentTime = 0;


      await audio.play();



    } catch(err) {


      console.log(
        "Crash sound error:",
        err
      );


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

      {children}

    </SoundContext.Provider>

  );

}



export const useSound = () => useContext(SoundContext);
