// Shared audio state for music reactivity

export const musicState = {
  isPlaying: false,
  bassLevel: 0,
  midLevel: 0,
  trebleLevel: 0,
  overallEnergy: 0,
};

export function updateMusicState(bass: number, mid: number, treble: number, energy: number) {
  musicState.bassLevel = musicState.bassLevel * 0.8 + bass * 0.2;
  musicState.midLevel = musicState.midLevel * 0.8 + mid * 0.2;
  musicState.trebleLevel = musicState.trebleLevel * 0.8 + treble * 0.2;
  musicState.overallEnergy = musicState.overallEnergy * 0.8 + energy * 0.2;
}

export function decayMusicState() {
  musicState.bassLevel *= 0.95;
  musicState.midLevel *= 0.95;
  musicState.trebleLevel *= 0.95;
  musicState.overallEnergy *= 0.95;
}

export function setMusicPlaying(playing: boolean) {
  musicState.isPlaying = playing;
}
