
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
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
};

export const scheduleReminder = (title: string, body: string, delayMs: number = 5000) => {
    if (Notification.permission === 'granted') {
        // Simple timeout simulation for now - real app would use Push API or local notifications
        setTimeout(() => {
            new Notification(title, {
                body,
                icon: '/assets/icon-192.png',
                badge: '/assets/icon-192.png'
            });
        }, delayMs);
    }
};

export const sendWelcomeNotification = () => {
    scheduleReminder(
        "Welcome to Mindful Architecture",
        "Great to have you here! We'll remind you to take a breath.",
        1000
    );
};
