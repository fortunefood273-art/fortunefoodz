const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// Find the mute button toggle logic
const muteButtonRegex = /<button\s*onClick=\{[^}]*\}\s*title=\{isMuted \? 'Unmute Music' : 'Mute Music'\}/;
const newMuteButton = `<button
          onClick={() => {
            const audio = audioRef.current;
            if (audio) {
              if (isMuted) {
                // We are unmuting, make sure it plays
                audio.play().catch(() => {});
              }
            }
            setIsMuted(!isMuted);
          }}
          title={isMuted ? 'Unmute Music' : 'Mute Music'}`;

if (c.match(muteButtonRegex)) {
  c = c.replace(muteButtonRegex, newMuteButton);
} else {
  console.log("Could not find mute button");
}

// Find useEffect for global interaction to start playing if not muted
const effectRegex = /useEffect\(\(\) => \{\s*window\.scrollTo\(0, 0\);\s*\}, \[location\.pathname\]\);/;
const globalInteractionEffect = `useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle first user interaction to start background music
  useEffect(() => {
    const handleFirstInteraction = () => {
      const audio = audioRef.current;
      if (audio && !isMuted && audio.paused) {
        audio.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isMuted]);`;

if (c.match(effectRegex)) {
  c = c.replace(effectRegex, globalInteractionEffect);
} else {
  console.log("Could not find location effect");
}

// Ensure the audio tag has autoPlay=true (it will be blocked but it's a good fallback)
const audioTagRegex = /<audio\s*ref=\{audioRef\}\s*id="site-bg-audio"\s*src=\{frontendSettings\?\.siteAudioUrl \|\| '\/background\.mp3'\}\s*loop\s*preload="none"\s*muted=\{isMuted\}\s*\/>/;
const newAudioTag = `<audio
        ref={audioRef}
        id="site-bg-audio"
        src={frontendSettings?.siteAudioUrl || '/background.mp3'}
        loop
        autoPlay
        preload="auto"
        muted={isMuted}
      />`;

if (c.match(audioTagRegex)) {
  c = c.replace(audioTagRegex, newAudioTag);
} else {
  console.log("Could not find audio tag");
}

fs.writeFileSync('src/App.jsx', c);
console.log('App.jsx updated successfully.');
