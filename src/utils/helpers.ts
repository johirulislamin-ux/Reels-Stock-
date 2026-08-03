import confetti from 'canvas-confetti';

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatWatchHours(hours: number): string {
  if (hours >= 1_000) {
    return (hours / 1_000).toFixed(1) + 'K hrs';
  }
  return hours.toFixed(1) + ' hrs';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function triggerConfettiCelebration() {
  try {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#60a5fa', '#a855f7', '#ec4899', '#f59e0b']
    });
  } catch (err) {
    console.error('Confetti failed to trigger:', err);
  }
}
