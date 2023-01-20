import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('setRead method', () => {
    let notificationCenterObject = new NotificationCenter;

    beforeAll(() => {
        fetchMock.resetMocks();
    });

    test('If setRead method is called for a local notification list, it should mark as read the notification whose id is taken as a parameter', async () => {
        const sender = 'AnyValidSender';
        notificationCenterObject.setSender(sender);

        const localNotificationsList = notificationCenterObject.notificationsList;

        const newNotification = {
            title: 'There is a new notification',
            message: 'Hello, im the first notification!'
        };
        await notificationCenterObject.sendNotification(newNotification);

        let lastNotification = localNotificationsList[localNotificationsList.length - 1];
        await notificationCenterObject.setRead(lastNotification.id);
        expect(lastNotification.readAt).toBeDefined();
    });

    test('If setRead method is called for a remote notifcation list, it should mark as read the notification whose id is taken as a parameter', async () => {
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
        let lastElement = serverNotificationsList[serverNotificationsList.length - 1];
        await notificationCenterObject.setRead(lastElement.id);
        expect(lastElement.readAt).toBeDefined();
    });

    test('If setRead method is launched, it should call the subscribed callback', async () => {
        const fn = jest.fn();
        notificationCenterObject.addSubscriber(fn);

        const serverNotificationsList = await notificationCenterObject.getNotifications();
        let lastElement = serverNotificationsList[serverNotificationsList.length - 1];
        await notificationCenterObject.setRead(lastElement.id);

        expect(fn).toBeCalled();
    });
}) 