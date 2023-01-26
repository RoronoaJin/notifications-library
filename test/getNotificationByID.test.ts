import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe(' method', () => {
    let notificationCenterObject = new NotificationCenter;
    const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };

    beforeEach(() => {
        fetchMock.resetMocks();
        notificationCenterObject.notificationsList = [];
    });

    test('If getNotificationByID is called for a local notification list, it should return the notification whose id is taken as a parameter', async () => {
        const localNotificationsList = notificationCenterObject.notificationsList;

        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the only notification!'
        };

        await notificationCenterObject.sendNotification(notification);

        let lastNotification = localNotificationsList[localNotificationsList.length - 1];

        const expectedNotification = await notificationCenterObject.getNotificationByID(lastNotification.id);

        expect(expectedNotification?.data).toEqual(notification);
    });

    test('If getNotificationByID method is called for a remote notification list, it should throw an error if the server response is not ok', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockResponseOnce(JSON.stringify({ ok: false }), { status: 404 });

        await expect(notificationCenterObject.getNotificationByID('notification.id')).rejects.toThrow();
    });

    test('If getNotificationByID is called for a remote notification list, it should return the notification whose id is taken as a parameter', async () => {
        notificationCenterObject.setConfig(configuration);

        const mockNotificationsList: Notification[] = [{
            id: 'abuis-34265-s',
            data: {
                title: 'There is the first notification',
                message: 'Hello, im the first notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 1674204568
        }, {
            id: 'abuisaas-14455-scasd',
            data: {
                title: 'There is the second notification',
                message: 'Hello, im the second notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 1111111115
        }, {
            id: 'asdsdaw-3232is-34265-zzs',
            data: {
                title: 'There is the third notification',
                message: 'Hello, im the third notification!'
            },
            sender: 'APP_SENDER',
            createdAt: 123434344568
        }];

        fetchMock.mockResponse(JSON.stringify(mockNotificationsList));

        const remoteNotificationsList = await notificationCenterObject.getAllNotifications();

        let lastNotification = remoteNotificationsList[remoteNotificationsList.length - 1];

        const expectedNotification = await notificationCenterObject.getNotificationByID(lastNotification.id);

        expect(expectedNotification).toEqual(lastNotification);
    });

    test('If getNotificationByID method is called, it should throw an error if the notification is not found', async () => {
        notificationCenterObject.setConfig(configuration);

        await expect(notificationCenterObject.getNotificationByID('not-existing-id')).rejects.toThrow();
    });
});