import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect
} from "react";


const SoundContext = createContext(null);



export function SoundProvider({ children }) {


  // 🔇 OFF BY DEFAULT
  const [soundOn, setSoundOn] = useState(false);


  const soundState = useRef(false);


  const aviatorRef = useRef(null);
  const crashRef = useRef(null);




  const unlockAudio = async () => {

    try {

      if (aviatorRef.current) {

        aviatorRef.current.volume = 1;

        await aviatorRef.current.play();

        aviatorRef.current.pause();

        aviatorRef.current.currentTime = 0;

      }


      if (crashRef.current) {

        crashRef.current.volume = 1;

        await crashRef.current.play();

        crashRef.current.pause();

        crashRef.current.currentTime = 0;

      }


    } catch(err) {

      console.log(
        "Audio unlock failed:",
        err
      );

    }

  };






  const toggleSound = () => {


    const next = !soundState.current;


    soundState.current = next;

    setSoundOn(next);




    if (!next) {


      if (aviatorRef.current) {

        aviatorRef.current.pause();

      }


      if (crashRef.current) {

        crashRef.current.pause();

      }


      return;

    }



    // 🔊 unlock browser audio after user gesture
    unlockAudio();


  };









  const playEngine = () => {


    if (!soundState.current) return;



    const audio = aviatorRef.current;


    if (!audio) return;



    audio.loop = true;

    audio.volume = 1;




    if (audio.paused) {


      audio.play()

      .catch(err => {

        console.log(
          "Engine blocked:",
          err
        );

      });


    }


  };









  const stopEngine = () => {


    const audio = aviatorRef.current;


    if (!audio) return;



    audio.pause();


  };









  const playCrash = () => {


    if (!soundState.current) return;



    const audio = crashRef.current;


    if (!audio) return;



    audio.pause();


    audio.currentTime = 0;


    audio.volume = 1;




    audio.play()

    .catch(err => {

      console.log(
        "Crash blocked:",
        err
      );

    });


  };









  useEffect(() => {


    return () => {


      if (aviatorRef.current) {

        aviatorRef.current.pause();

      }


      if (crashRef.current) {

        crashRef.current.pause();

      }


    };


  }, []);









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

        playsInline

      />



      <audio

        ref={crashRef}

        src="/sounds/crash.mp3"

        preload="auto"

        playsInline

      />



      {children}


    </SoundContext.Provider>

  );


}






export const useSound = () => useContext(SoundContext);
