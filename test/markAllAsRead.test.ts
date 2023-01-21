import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('markAllAsRead method', () => {
    let notificationCenterObject = new NotificationCenter;

    beforeAll(() => {
        fetchMock.resetMocks();
    });

    beforeEach(() => {
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

    test('If markAllAsRead method is called for a remote notification list, it should mark as read all the notifications', async () => {
        const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };
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

        const serverNotificationsList = await notificationCenterObject.getNotifications();

        await notificationCenterObject.markAllAsRead();

        serverNotificationsList.forEach(notification => { expect(notification.readAt).toBeDefined() });
    });
});