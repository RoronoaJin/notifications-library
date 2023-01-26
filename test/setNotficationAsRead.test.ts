import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('setNotficationAsRead method', () => {
    let notificationCenterObject = new NotificationCenter;
    const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };

    beforeEach(() => {
        fetchMock.resetMocks();
        notificationCenterObject.notificationsList = [];
    });

    test('If setNotficationAsRead method is called for a local notification list, it should mark as read the notification whose id is taken as a parameter', async () => {
        const localNotificationsList = notificationCenterObject.notificationsList;

        const newNotification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };

        await notificationCenterObject.sendNotification(newNotification);

        let lastNotification = localNotificationsList[localNotificationsList.length - 1];
        await notificationCenterObject.setNotficationAsRead(lastNotification.id);
        expect(lastNotification.readAt).toBeDefined();
    });


    test('If setNotficationAsRead method is called for a remote notification list, it should throw an error if the server response is not ok', async () => {
        notificationCenterObject.setConfig(configuration);

        fetchMock.mockResponseOnce(JSON.stringify({ ok: false }), { status: 404 });

        await expect(notificationCenterObject.setNotficationAsRead('notification.id')).rejects.toThrow();
    });

    test('If setNotficationAsRead method is called for a remote notifcation list, it should mark as read the notification whose id is taken as a parameter', async () => {
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

        const serverNotificationsList = await notificationCenterObject.getAllNotifications();
        let lastElement = serverNotificationsList[serverNotificationsList.length - 1];
        await notificationCenterObject.setNotficationAsRead(lastElement.id);
        expect(lastElement.readAt).toBeDefined();
    });

    test('If setNotficationAsRead method is called, it should call the subscribed callback', async () => {
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
        }];

        fetchMock.mockResponse(JSON.stringify(mockNotificationsList));

        const fn = jest.fn();
        notificationCenterObject.addSubscriber(fn);

        const serverNotificationsList = await notificationCenterObject.getAllNotifications();
        let lastElement = serverNotificationsList[serverNotificationsList.length - 1];
        await notificationCenterObject.setNotficationAsRead(lastElement.id);

        expect(fn).toBeCalled();
    });

    test('If setNotficationAsRead method is called, it should throw an error if the notification is not found', async () => {
        notificationCenterObject.setConfig(configuration);

        await expect(notificationCenterObject.setNotficationAsRead('not-existing-id')).rejects.toThrow();
    });
});