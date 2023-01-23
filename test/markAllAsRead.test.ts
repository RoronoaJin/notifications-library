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

    test('If markAllAsRead method is called for a remote notification list, it should throw an error if the server response is not ok', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockResponseOnce(JSON.stringify({ ok: false }), { status: 404 });

        await expect(notificationCenterObject.markAllAsRead()).rejects.toThrow();
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

    test('If markAllAsRead method is called, it should throw an error if all the notifications are marked as read', async () => {
        notificationCenterObject.setConfig(configuration);

        const mockNotificationsList: Notification[] = [{
            id: 'notf-676657-fd-44',
            data: {
                title: 'There is the first notification',
                message: 'Hello, im the first notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 1674209344568,
            readAt: 1202930283
        }, {
            id: 'notf-13232-af-33',
            data: {
                title: 'There is the second notification',
                message: 'Hello, im the second notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 167342114568,
            readAt: 44442312
        }];

        fetchMock.mockResponse(JSON.stringify(mockNotificationsList));

        await notificationCenterObject.getAllNotifications();

        await expect(notificationCenterObject.markAllAsRead()).rejects.toThrow();
    });
});