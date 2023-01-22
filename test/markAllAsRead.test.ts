import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('markAllAsRead method', () => {
    let notificationCenterObject = new NotificationCenter;
    const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };

    beforeEach(() => {
        fetchMock.resetMocks();
        notificationCenterObject.notificationsList = [];
    });

    test('If markAllAsRead method is called for a local notification list, it should mark as read all the notifications', async () => {
        const localNotificationsList = notificationCenterObject.notificationsList;

        const firstNotification = {
            title: 'There is a new notification',
            message: 'Hello, im the only notification!'
        };

        await notificationCenterObject.sendNotification(firstNotification);

        const secondNotification = {
            title: 'There is a new notification',
            message: 'Hello, im the only notification!'
        };

        await notificationCenterObject.sendNotification(secondNotification);

        await notificationCenterObject.markAllAsRead();

        localNotificationsList.forEach(notification => { expect(notification.readAt).toBeDefined() });
    });

    test('If markAllAsRead method is called for a remote notification list, it should throw an error if there is something wrong with the HTTP call', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockRejectOnce(new Error('Error: something went wrong'));

        try {
            await notificationCenterObject.markAllAsRead();
        } catch (error) {
            expect(error.message).toEqual('Error: something went wrong');
        }
    });

    test('If markAllAsRead method is called for a remote notification list, it should throw an error if the server response is not ok', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockResponse(JSON.stringify({ ok: false }), { status: 400 });

        try {
            await notificationCenterObject.markAllAsRead();
        } catch (error) {
            expect(error.message).toEqual(400);
        }
    });

    test('If markAllAsRead method is called for a remote notification list, it should mark as read all the notifications', async () => {
        notificationCenterObject.setConfig(configuration);

        const mockNotificationsList: Notification[] = [{
            id: 'abuis-34265-s',
            data: {
                title: 'There is the first notification',
                message: 'Hello, im the first notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 1674209344568
        }, {
            id: 'abuisaas-14455-scasd',
            data: {
                title: 'There is the second notification',
                message: 'Hello, im the second notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 167342114568
        }, {
            id: 'asdsdaw-3232is-34265-zzs',
            data: {
                title: 'There is the third notification',
                message: 'Hello, im the third notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 123434344568
        }, {
            id: 'nosjnvo-4564653-erds',
            data: {
                title: 'There is the fourth notification',
                message: 'Hello, im the fourth notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 1111111111
        }];

        fetchMock.mockResponse(JSON.stringify(mockNotificationsList));

        const remoteNotificationsList = await notificationCenterObject.getAllNotifications();

        await notificationCenterObject.markAllAsRead();

        remoteNotificationsList.forEach(notification => { expect(notification.readAt).toBeDefined() });
    });
});