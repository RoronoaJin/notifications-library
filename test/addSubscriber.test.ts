import { NotificationCenter } from '../src/index'

describe('addSubscriber method', () => {
    let notificationCenterObject = new NotificationCenter;
    let subscribersList = notificationCenterObject.subscribers;

    test('If addSubscriber method is called, it should subscribe the callback passed as argument into the subscribers list', async () => {

        expect(subscribersList).toHaveLength(0);

        const fn = jest.fn();
        notificationCenterObject.addSubscriber(fn);

        expect(subscribersList).toHaveLength(1);
    });
});