import React, { createContext, useContext, useRef, useState } from "react";

const SoundContext = createContext(null);

export function SoundProvider({ children }) {

  const [soundOn, setSoundOn] = useState(true);

  const aviatorRef = useRef(null);
  const crashRef = useRef(null);

  // toggle sound
  const toggleSound = () => {
    setSoundOn(prev => {
      const next = !prev;

      if (!next && aviatorRef.current) {
        aviatorRef.current.pause();
        aviatorRef.current.currentTime = 0;
      }

      return next;
    });
  };

  // 🎵 THIS MATCHES YOUR CODE: playEngine()
  const playEngine = () => {
    if (!soundOn) return;

    if (aviatorRef.current) {
      aviatorRef.current.loop = true;
      aviatorRef.current.volume = 0.5;
      aviatorRef.current.play().catch(() => {});
    }
  };

  // 🛑 THIS MATCHES YOUR CODE: stopEngine()
  const stopEngine = () => {
    if (aviatorRef.current) {
      aviatorRef.current.pause();
      aviatorRef.current.currentTime = 0;
    }
  };

  // 💥 CRASH SOUND
  const playCrash = () => {
    if (!soundOn) return;

    if (crashRef.current) {
      crashRef.current.currentTime = 0;
      crashRef.current.play().catch(() => {});
    }
  };

  return (
    <SoundContext.Provider value={{
      soundOn,
      toggleSound,
      playEngine,
      stopEngine,
      playCrash
    }}>

      {/* ONLY TWO SOUNDS */}
      <audio ref={aviatorRef} src="/sounds/aviator.mp3" preload="auto" />
      <audio ref={crashRef} src="/sounds/crash.mp3" preload="auto" />

      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
