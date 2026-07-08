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



  // 🔊 Toggle sound
  const toggleSound = () => {

    const next = !soundState.current;

    soundState.current = next;
    setSoundOn(next);


    if (!next && aviatorRef.current) {

      aviatorRef.current.pause();

    }

  };



  // ✈️ Engine start
  const playEngine = () => {


    if (!soundState.current) return;


    const audio = aviatorRef.current;


    if (!audio) return;



    audio.loop = true;
    audio.volume = 1;



    // prevent restarting already playing sound
    if (audio.paused) {

      audio.play()
      .catch(err => {

        console.log(
          "Engine sound blocked:",
          err
        );

      });

    }

  };



  // 🛑 Engine stop
  const stopEngine = () => {


    const audio = aviatorRef.current;


    if (!audio) return;


    audio.pause();

    // IMPORTANT:
    // Do not reset currentTime here.
    // Resetting caused next rounds to lose sound.

  };



  // 💥 Crash sound
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
        "Crash sound blocked:",
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
