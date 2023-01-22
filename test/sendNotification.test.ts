import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('sendNotification method', () => {
    let notificationCenterObject = new NotificationCenter;
    const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };

    beforeEach(() => {
        fetchMock.resetMocks();
        notificationCenterObject.notificationsList = [];
    });

    test('If sendNotification method is called for a remote notification list, it should throw an error if there is something wrong with the HTTP call', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockRejectOnce(new Error('Error: something went wrong'));

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        try {
            await notificationCenterObject.sendNotification(notification);
        } catch (error) {
            expect(error.message).toEqual('Error: something went wrong');
        }
    });

    test('If sendNotification method is called for a remote notification list, it should throw an error if the server response is not ok', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockResponse(JSON.stringify({ ok: false }), { status: 400 });

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        try {
            await notificationCenterObject.sendNotification(notification);
        } catch (error) {
            expect(error.message).toEqual(400);
        }
    });

    test('If sendNotification method is called and there is a configuration set in the singleton, a notification should be added to the notifications list', async () => {
        notificationCenterObject.setConfig(configuration);

        const mockNotificationsList: Notification[] = [];

        fetchMock.mockResponse(JSON.stringify(mockNotificationsList));

        const remoteNotificationsList = await notificationCenterObject.getAllNotifications();

        expect(remoteNotificationsList).toHaveLength(0);

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        await notificationCenterObject.sendNotification(notification);

        expect(remoteNotificationsList).toHaveLength(1);
    });

    test('If sendNotification method is called and there is no configuration set in the singleton, a notification should be added to the notifications list', async () => {
        const localNotificationsList = notificationCenterObject.notificationsList;

        expect(localNotificationsList).toHaveLength(0);

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        await notificationCenterObject.sendNotification(notification);

        expect(localNotificationsList).toHaveLength(1);
    });

    test('If sendNotification method is called, it should return a notification with all the params defined except for readAt', async () => {
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

    test('If sendNotification method is launched, it should call the subscribed callback', async () => {
        const fn = jest.fn();
        notificationCenterObject.addSubscriber(fn);

        await notificationCenterObject.sendNotification({
            title: 'New notification',
            message: 'Hello!'
        });

        expect(fn).toBeCalled();
    });
});