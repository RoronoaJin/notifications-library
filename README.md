# Notifications-library
Notifications-library is a small and simple library in TypeScript to manage a notifications system

## Usage

Create an instance of the NotificationCenter
```TypeScript
    const notificationCenterObject = new NotificationCenter;
```
If you want to use a remote system, set the configuration
```TypeScript
  const configuration = { fetchUrl: 'anyValidURL1', 
                          createUrl: 'anyValidURL2',               
                          updateUrl:'anyValidURL3' };
  notificationCenterObject.setConfig(configuration);
```
otherwise you can have a full local system.

You can set the sender of the notifications
```TypeScript
  const sender = 'AnyValidSender';
  notificationCenterObject.setSender(sender);
```
## API

There are different methods offered by the NotificationCenter

### getNotifications()
This method allow the user to get the notifications list
```TypeScript
await notificationCenterObject.getNotifications();
```

### sendNotification()
This method allow the user to send a notification
```TypeScript
const notification = {
    title: 'There is a new notification',
    message: 'Hello, im the first notification!'
};
await notificationCenterObject.sendNotification(notification);
```

### setRead()
This method allow the user to mark a notification as read
```TypeScript
// notification.id is the id of the notification you want to mark as read
await notificationCenterObject.setRead(notification.id);
```

### addSubscriber()
This method allow the user to subscribe to the NotificationCenter and get notify each time a new notification is sent or read
```TypeScript
// This function will be called each time a new notification is sent or read
function onNewNotification(notification: Notification) {
  console.log(notification);
}

// onNewNotification is subscribed
notificationCenterObject.addSubscriber(onNewNotification);
```
