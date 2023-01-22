import { NotificationCenter } from '../src/index'


describe('setSender method', () => {
    let notificationCenterObject = new NotificationCenter;

    test('If setSender method is called, it should set the sender of the notification', async () => {
        notificationCenterObject.setSender('TestSender');

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        await notificationCenterObject.sendNotification(notification);
        const localNotificationsList = await notificationCenterObject.getAllNotifications();
        let lastNotification = localNotificationsList[localNotificationsList.length - 1];
        expect(lastNotification.sender).toBe('TestSender');
    });
});