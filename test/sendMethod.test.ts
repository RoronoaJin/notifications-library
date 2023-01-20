import { NotificationCenter } from '../src/index'

describe('send method when a configuration is set in the singleton', () => {
    let notificationCenterObject = new NotificationCenter;
    const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };
    notificationCenterObject.setConfig(configuration);

    test('If send method is called and there is a configuration set in the singleton, a notification should be added to the notifications list', async () => {
        expect(notificationCenterObject.notificationsList).toHaveLength(0);

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        await notificationCenterObject.sendNotification(notification);

        expect(notificationCenterObject.notificationsList).toHaveLength(1);
    })

    test('If send method is called, it should return a notification with all the params defined except for readAt', async () => {
        const notification = {
            title: 'New notification',
            message: 'Hello!'
        };
        const sentNotification = await notificationCenterObject.sendNotification(notification);

        expect(sentNotification.data).toEqual(notification);
        expect(sentNotification.id).toBeDefined();
        expect(sentNotification.sender).toBeDefined();
        expect(sentNotification.createdAt).toBeDefined();
        expect(sentNotification.readAt).toBeUndefined();
    });

    test('If send method is launched, it should call the subscribed callback', async () => {
        const fn = jest.fn();
        notificationCenterObject.addSubscriber(fn);

        await notificationCenterObject.sendNotification({
            title: 'New notification',
            message: 'Hello!'
        });

        expect(fn).toBeCalled();
    });
})

describe('send method when a configuration is not set in the singleton', () => {
    let notificationCenterObject = new NotificationCenter;
    const sender = 'AnyValidSender'
    notificationCenterObject.setSender(sender);

    test('If send method is called and there is no configuration set in the singleton, a notification should be added to the notifications list', async () => {
        expect(notificationCenterObject.notificationsList).toHaveLength(0);

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        await notificationCenterObject.sendNotification(notification);

        expect(notificationCenterObject.notificationsList).toHaveLength(1);
    });

    test('If send method is called, it should return a notification with all the params defined except for readAt', async () => {
        const notification = {
            title: 'New notification',
            message: 'Hello!'
        };
        const sentNotification = await notificationCenterObject.sendNotification(notification);

        expect(sentNotification.data).toEqual(notification);
        expect(sentNotification.id).toBeDefined();
        expect(sentNotification.sender).toEqual(sender);
        expect(sentNotification.createdAt).toBeDefined();
        expect(sentNotification.readAt).toBeUndefined();
    });
})