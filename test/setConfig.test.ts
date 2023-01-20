import { NotificationCenter } from '../src/index'

describe('setConfig method', () => {
    let notificationCenterObject = new NotificationCenter;

    test('If setConfing method is not called, the singleton should have config parameter as undefined', () => {
        const actualConfiguration = notificationCenterObject.getConfig()
        expect(actualConfiguration).toBeUndefined();
    })

    test('If setConfig method is called, it should set the configuration of the endpoints', () => {
        const userConfig = { fetchUrl: 'anyValidURL1', createUrl: 'anyValidURL2', updateUrl: 'anyValidURL3' };
        notificationCenterObject.setConfig(userConfig);
        const actualConfiguration = notificationCenterObject.getConfig()
        expect(actualConfiguration).toEqual(userConfig);
    });
});