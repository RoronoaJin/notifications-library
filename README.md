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

There are different methods offered by the NotificationCenter class

### getAllNotifications()
This method allow the user to get the notifications list
```TypeScript
await notificationCenterObject.getAllNotifications();
```

### getNotificationByID(id: string)
This method allow the user to get a specific notification by passing its ID as argument
```TypeScript
// notification.id is the id of the notification you want to get
const requestedNotification = await notificationCenterObject.getNotificationByID(notification.id);
```

### sendNotification(data: any)
This method allow the user to send a notification
```TypeScript
const notification = {
    title: 'There is a new notification',
    message: 'Hello, im the first notification!'
};

await notificationCenterObject.sendNotification(notification);
```

### markNotificationAsRead(id: string)
This method allow the user to mark a specific notification by passing its ID as argument
```TypeScript
// notification.id is the id of the notification you want to mark as read
await notificationCenterObject.markNotificationAsRead(notification.id);
```

### markAllAsRead()
This method allow the user to mark all the notifications as read
```TypeScript
await notificationCenterObject.markAllAsRRead();
```

### deleteNotificationByID(id: string)
This method allow the user to delete a specific notification by passing its ID as argument
```TypeScript
// notification.id is the id of the notification you want to delete
await notificationCenterObject.deleteNotificationByID(notification.id);
```

### deleteAllNotifications()
This method allow the user to delete all the notifications
```TypeScript
await notificationCenterObject.deleteAllNotifications();
```

### addSubscriber(callback: SubscribeCallback)
This method allow the user to subscribe to the NotificationCenter and get notify each time a new notification is sent or read
```TypeScript
// This function will be called each time a new notification is sent or read
function onNewNotification(notification: Notification) {
  console.log(notification);
}

// onNewNotification is subscribed
notificationCenterObject.addSubscriber(onNewNotification);
```
