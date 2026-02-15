export async function requestNotificationPermission(userId: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function schedulePracticeReminder(hour: number = 9, minute: number = 0): void {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    showLocalNotification(
      'Time to Practice! 🗣️',
      'Keep your Darija skills sharp with a quick practice session.'
    );
    
    schedulePracticeReminder(hour, minute);
  }, delay);
}

export function showLocalNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }
}

export function checkAndRequestPermission(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'default') {
    console.log('Notification permission not set yet');
  }
}
