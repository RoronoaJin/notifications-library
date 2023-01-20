export type Notification = {
    id: string;
    data: any;
    sender: string;
    readAt?: number;
    createdAt: number;
}

export type NotificationCenterConfig = {
    fetchUrl: string;
    updateUrl: string;
    createUrl: string;
}

export type SubscribeCallback = (notification: Notification) => void;