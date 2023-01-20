import { NotificationCenter } from '../src/index'
import { Notification } from '../src/types';
import 'jest-fetch-mock';

describe('get method', () => {
    let notificationCenterObject = new NotificationCenter;

    beforeAll(() => {
        fetchMock.resetMocks();
    });

    test('If get method is called for a local notification list, it should return the same local notifications list', async () => {
        const localNotificationsList = notificationCenterObject.notificationsList;

        const expectedNotificationsList = await notificationCenterObject.getNotifications();

        expect(expectedNotificationsList).toEqual(localNotificationsList);
    });

    test('If get method is called for a remote notification list, it should return the same notifications list of the server', async () => {
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

        const expectedNotificationsList = await notificationCenterObject.getNotifications();

        expect(expectedNotificationsList).toEqual(mockNotificationsList);
    });
})