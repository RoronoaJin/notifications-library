import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('deleteNotificationByID method', () => {
    let notificationCenterObject = new NotificationCenter;

    beforeAll(() => {
        fetchMock.resetMocks();
    });

    beforeEach(() => {
        notificationCenterObject.notificationsList = [];
    });

    test('If deleteNotificationByID is called for a local notification list, it should delete the notification whose id is taken as a parameter', async () => {
        const notification = {
            title: 'There is a new notification',
            message: 'Hello, im the only notification!'
        };

        await notificationCenterObject.sendNotification(notification);

        let lastNotification = notificationCenterObject.notificationsList[notificationCenterObject.notificationsList.length - 1];

        await notificationCenterObject.deleteNotificationByID(lastNotification.id);

        expect(notificationCenterObject.notificationsList).toHaveLength(0);
    });

    test('If deleteNotificationByID is called for a remote notification list, it should delete the notification whose id is taken as a parameter', async () => {
        const configuration = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };
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

        await notificationCenterObject.getNotifications();

        let lastNotification = notificationCenterObject.notificationsList[notificationCenterObject.notificationsList.length - 1];

        await notificationCenterObject.deleteNotificationByID(lastNotification.id);

        expect(notificationCenterObject.notificationsList).toHaveLength(2);
    });
});