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



  const unlockAudio = async () => {

    try {

      if (aviatorRef.current) {

        aviatorRef.current.volume = 0;

        await aviatorRef.current.play();

        aviatorRef.current.pause();

        aviatorRef.current.currentTime = 0;

        aviatorRef.current.volume = 1;

      }


    } catch(err){

      console.log("Audio unlock failed", err);

    }

  };





  const toggleSound = async () => {


    const next = !soundState.current;


    soundState.current = next;


    setSoundOn(next);




    if(next){


      await unlockAudio();


      if(aviatorRef.current){

        aviatorRef.current.volume = 1;

      }


      if(crashRef.current){

        crashRef.current.volume = 1;

      }


      return;

    }





    if(aviatorRef.current){

      aviatorRef.current.pause();

      aviatorRef.current.currentTime = 0;

    }


    if(crashRef.current){

      crashRef.current.pause();

      crashRef.current.currentTime = 0;

    }


  };






  const playEngine = async () => {

    console.log("playEngine called:", soundState.current);


    if(!soundState.current) return;


    const audio = aviatorRef.current;


    if(!audio) return;



    audio.loop = true;
    audio.volume = 1;



    try {

        if(audio.paused){

            await audio.play();

            console.log("Engine playing");

        }

    } catch(err){

        console.log(
            "Engine blocked:",
            err
        );

    }

};





  const stopEngine = () => {


    const audio = aviatorRef.current;


    if(!audio) return;


    audio.pause();


  };






  const playCrash = () => {


    if(!soundState.current) return;


    const audio = crashRef.current;


    if(!audio) return;




    audio.pause();


    audio.currentTime = 0;


    audio.volume = 1;



    audio.play()

    .catch(err=>{

      console.log(
        "Crash blocked:",
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
