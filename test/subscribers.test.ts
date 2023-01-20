import { NotificationCenter } from '../src/index'

describe('After creating the singleton instance...', () => {
    let notificationCenterObject = new NotificationCenter;
    let subscribersList = notificationCenterObject.subscribers;

    test('If subscribe method is launched, it should subscribe the callback passed as argument into the subscribers list', async () => {

        expect(subscribersList).toHaveLength(0);

        const fn = jest.fn();
        notificationCenterObject.addSubscriber(fn);

        expect(subscribersList).toHaveLength(1);
    });
});